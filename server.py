from __future__ import annotations

import json
import os
import re
import secrets
import sqlite3
import time
from datetime import datetime, timezone
from functools import wraps
from pathlib import Path

from flask import Flask, g, jsonify, request, send_from_directory, session
from werkzeug.security import check_password_hash, generate_password_hash

from extra_questions import EXTRA_QUESTIONS
from pdf_questions_2567 import PDF_QUESTIONS_2567

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATABASE_PATH = Path(os.environ.get("DATABASE_PATH", DATA_DIR / "exam_coach.sqlite3"))

app = Flask(__name__, static_folder=None)
app.config["JSON_AS_ASCII"] = False
app.config.update(
    SECRET_KEY=os.environ.get("SECRET_KEY", secrets.token_hex(32)),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.environ.get("COOKIE_SECURE", "1") == "1",
    PERMANENT_SESSION_LIFETIME=60 * 60 * 8,
)

QUESTION_STATUSES = {"draft", "pending", "published", "paused"}
ADMIN_ROLES = {"head", "admin"}


def get_database() -> sqlite3.Connection:
    if "database" not in g:
        DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
        g.database = sqlite3.connect(DATABASE_PATH, timeout=10)
        g.database.row_factory = sqlite3.Row
        g.database.execute("PRAGMA foreign_keys=ON")
        g.database.execute("PRAGMA journal_mode=WAL")
        g.database.execute("PRAGMA busy_timeout=10000")
    return g.database


@app.teardown_appcontext
def close_database(_error: BaseException | None) -> None:
    database = g.pop("database", None)
    if database is not None:
        database.close()


@app.after_request
def add_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; "
        "frame-ancestors 'self'; base-uri 'self'; form-action 'self'"
    )
    return response


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def ensure_columns(database: sqlite3.Connection, table: str, columns: dict[str, str]) -> None:
    existing = {row["name"] for row in database.execute(f"PRAGMA table_info({table})").fetchall()}
    for name, definition in columns.items():
        if name not in existing:
            database.execute(f"ALTER TABLE {table} ADD COLUMN {name} {definition}")


def read_legacy_questions() -> list[tuple]:
    """อ่านคลังเดิม 50 ข้อจาก app.js เพื่อนำเข้า DB โดยไม่เก็บข้อมูลซ้ำสองชุด"""
    source = (BASE_DIR / "app.js").read_text(encoding="utf-8")
    pattern = re.compile(
        r'\{id:(\d+),topic:"([^"]+)",q:"([^"]+)",o:\[(.*?)\],a:"([^"]+)",e:"([^"]+)"\}'
    )
    questions = []
    for match in pattern.finditer(source):
        options = re.findall(r'"([^"]*)"', match.group(4))
        if len(options) == 4:
            questions.append((int(match.group(1)), match.group(2), match.group(3), options, match.group(5), match.group(6)))
    return questions


def initialize_database() -> None:
    database = get_database()
    database.executescript(
        """
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY,
            topic TEXT NOT NULL,
            question_text TEXT NOT NULL,
            options_json TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            explanation TEXT NOT NULL,
            is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_questions_active_topic ON questions(is_active, topic);
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            display_name TEXT NOT NULL COLLATE NOCASE UNIQUE,
            team_name TEXT NOT NULL DEFAULT 'MT4',
            access_token TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            score INTEGER NOT NULL CHECK(score >= 0),
            total_questions INTEGER NOT NULL CHECK(total_questions > 0),
            duration_seconds INTEGER NOT NULL DEFAULT 0 CHECK(duration_seconds >= 0),
            selected_topic TEXT NOT NULL DEFAULT 'ทุกหมวด',
            topic_scores_json TEXT NOT NULL DEFAULT '{}',
            completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_attempts_user_date ON attempts(user_id, completed_at DESC);
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL COLLATE NOCASE UNIQUE,
            password_hash TEXT NOT NULL,
            display_name TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('head', 'admin')),
            is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1)),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            last_login_at TEXT
        );
        CREATE TABLE IF NOT EXISTS question_versions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
            version_number INTEGER NOT NULL,
            snapshot_json TEXT NOT NULL,
            action TEXT NOT NULL,
            changed_by INTEGER REFERENCES admin_users(id),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(question_id, version_number)
        );
        CREATE INDEX IF NOT EXISTS idx_question_versions_question ON question_versions(question_id, version_number DESC);
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            admin_user_id INTEGER REFERENCES admin_users(id),
            action TEXT NOT NULL,
            entity_type TEXT NOT NULL,
            entity_id TEXT,
            details_json TEXT NOT NULL DEFAULT '{}',
            ip_address TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_audit_logs_date ON audit_logs(created_at DESC);
        CREATE TABLE IF NOT EXISTS login_throttle (
            throttle_key TEXT PRIMARY KEY,
            failure_count INTEGER NOT NULL DEFAULT 0,
            blocked_until INTEGER NOT NULL DEFAULT 0,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """
    )
    ensure_columns(database, "questions", {
        "status": "TEXT NOT NULL DEFAULT 'published'",
        "difficulty": "TEXT NOT NULL DEFAULT 'medium'",
        "exam_frequency": "TEXT NOT NULL DEFAULT 'medium'",
        "source_title": "TEXT NOT NULL DEFAULT ''",
        "source_url": "TEXT NOT NULL DEFAULT ''",
        "verified_at": "TEXT",
        "created_by": "INTEGER REFERENCES admin_users(id)",
        "approved_by": "INTEGER REFERENCES admin_users(id)",
        "published_at": "TEXT",
    })
    database.execute(
        "UPDATE questions SET status='published', published_at=COALESCE(published_at, created_at) "
        "WHERE status IS NULL OR status=''"
    )
    seed_rows = read_legacy_questions() + EXTRA_QUESTIONS
    database.executemany(
        """
        INSERT INTO questions(id, topic, question_text, options_json, correct_answer, explanation)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO NOTHING
        """,
        [(row[0], row[1], row[2], json.dumps(row[3], ensure_ascii=False), row[4], row[5]) for row in seed_rows],
    )
    database.executemany(
        """
        INSERT INTO questions(id, topic, question_text, options_json, correct_answer, explanation,
                              source_title, status, is_active, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'published', 1, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO NOTHING
        """,
        [
            (
                row[0], row[1], row[2], json.dumps(row[3], ensure_ascii=False), row[4], row[5],
                "แนวข้อสอบนายหน้าประกันภัย 2567 ได้จากแหววมา.pdf (หัวเอกสารระบุอัปเดต 2565)",
            )
            for row in PDF_QUESTIONS_2567
        ],
    )
    bootstrap_username = os.environ.get("ADMIN_USERNAME", "").strip()
    bootstrap_password = os.environ.get("ADMIN_PASSWORD", "")
    if bootstrap_username and len(bootstrap_password) >= 12:
        existing_admin = database.execute("SELECT id FROM admin_users LIMIT 1").fetchone()
        if existing_admin is None:
            database.execute(
                "INSERT INTO admin_users(username, password_hash, display_name, role) VALUES (?, ?, ?, 'admin')",
                (bootstrap_username, generate_password_hash(bootstrap_password), "ผู้ดูแลระบบ MT4"),
            )
    database.commit()


def serialize_question(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"], "topic": row["topic"], "q": row["question_text"],
        "o": json.loads(row["options_json"]), "a": row["correct_answer"], "e": row["explanation"],
    }


def serialize_admin_question(row: sqlite3.Row) -> dict:
    question = serialize_question(row)
    question.update({
        "status": row["status"], "isActive": bool(row["is_active"]),
        "difficulty": row["difficulty"], "examFrequency": row["exam_frequency"],
        "sourceTitle": row["source_title"], "sourceUrl": row["source_url"],
        "verifiedAt": row["verified_at"], "createdAt": row["created_at"],
        "updatedAt": row["updated_at"], "publishedAt": row["published_at"],
        "creatorName": row["creator_name"] if "creator_name" in row.keys() else None,
        "approverName": row["approver_name"] if "approver_name" in row.keys() else None,
    })
    return question


def current_admin() -> sqlite3.Row | None:
    admin_id = session.get("admin_user_id")
    if not admin_id:
        return None
    return get_database().execute(
        "SELECT id, username, display_name, role FROM admin_users WHERE id=? AND is_active=1", (admin_id,)
    ).fetchone()


def require_admin(*roles: str):
    def decorator(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            admin = current_admin()
            if admin is None:
                return jsonify({"error": "กรุณาเข้าสู่ระบบผู้ดูแล"}), 401
            if roles and admin["role"] not in roles:
                return jsonify({"error": "บัญชีนี้ไม่มีสิทธิ์ดำเนินการ"}), 403
            g.admin_user = admin
            if request.method not in {"GET", "HEAD", "OPTIONS"}:
                csrf_token = request.headers.get("X-CSRF-Token", "")
                if not csrf_token or not secrets.compare_digest(csrf_token, session.get("csrf_token", "")):
                    return jsonify({"error": "คำขอหมดอายุ กรุณาเข้าสู่ระบบใหม่"}), 403
            return view(*args, **kwargs)
        return wrapped
    return decorator


def record_audit(action: str, entity_type: str, entity_id: object = None, details: dict | None = None) -> None:
    admin = getattr(g, "admin_user", None)
    forwarded = request.headers.get("X-Forwarded-For", "")
    ip_address = (forwarded.split(",")[0].strip() or request.remote_addr or "")[:64]
    get_database().execute(
        """INSERT INTO audit_logs(admin_user_id, action, entity_type, entity_id, details_json, ip_address)
        VALUES (?, ?, ?, ?, ?, ?)""",
        (admin["id"] if admin else None, action, entity_type, str(entity_id) if entity_id is not None else None,
         json.dumps(details or {}, ensure_ascii=False), ip_address),
    )


def save_question_version(question_id: int, action: str, changed_by: int) -> None:
    database = get_database()
    row = database.execute("SELECT * FROM questions WHERE id=?", (question_id,)).fetchone()
    if row is None:
        return
    last_version = database.execute(
        "SELECT COALESCE(MAX(version_number), 0) AS number FROM question_versions WHERE question_id=?",
        (question_id,),
    ).fetchone()["number"]
    database.execute(
        """INSERT INTO question_versions(question_id, version_number, snapshot_json, action, changed_by)
        VALUES (?, ?, ?, ?, ?)""",
        (question_id, last_version + 1, json.dumps(dict(row), ensure_ascii=False), action, changed_by),
    )


def validate_question_payload(payload: dict) -> tuple[dict | None, str | None]:
    topic = " ".join(str(payload.get("topic", "")).split())[:100]
    question = " ".join(str(payload.get("q", "")).split())[:1000]
    explanation = " ".join(str(payload.get("e", "")).split())[:2000]
    options = [" ".join(str(value).split())[:500] for value in payload.get("o", [])]
    answer = " ".join(str(payload.get("a", "")).split())[:500]
    if not topic or len(question) < 10 or len(explanation) < 10:
        return None, "กรุณากรอกหมวด คำถาม และคำอธิบายให้ครบถ้วน"
    if len(options) != 4 or any(not option for option in options) or len(set(options)) != 4:
        return None, "ต้องมีตัวเลือกที่ไม่ซ้ำกันครบ 4 ตัวเลือก"
    if options.count(answer) != 1:
        return None, "กรุณาเลือกคำตอบที่ถูกต้องจากตัวเลือกเพียงหนึ่งข้อ"
    source_url = str(payload.get("sourceUrl", "")).strip()[:1000]
    if source_url and not re.match(r"^https://", source_url, re.IGNORECASE):
        return None, "ลิงก์อ้างอิงต้องขึ้นต้นด้วย https://"
    return {
        "topic": topic, "q": question, "e": explanation, "o": options, "a": answer,
        "difficulty": str(payload.get("difficulty", "medium")) if payload.get("difficulty") in {"easy", "medium", "hard"} else "medium",
        "examFrequency": str(payload.get("examFrequency", "medium")) if payload.get("examFrequency") in {"high", "medium", "low"} else "medium",
        "sourceTitle": " ".join(str(payload.get("sourceTitle", "")).split())[:300],
        "sourceUrl": source_url,
        "verifiedAt": str(payload.get("verifiedAt", "")).strip()[:10] or None,
    }, None


@app.get("/api/meta")
def api_meta():
    row = get_database().execute(
        "SELECT COUNT(*) AS total, COUNT(DISTINCT topic) AS topics FROM questions WHERE is_active=1 AND status='published'"
    ).fetchone()
    return jsonify({"totalQuestions": row["total"], "totalTopics": row["topics"], "examSize": 20})


@app.get("/api/topics")
def api_topics():
    rows = get_database().execute(
        "SELECT topic, COUNT(*) AS question_count FROM questions WHERE is_active=1 AND status='published' GROUP BY topic ORDER BY topic"
    ).fetchall()
    return jsonify([{"topic": row["topic"], "questionCount": row["question_count"]} for row in rows])


@app.get("/healthz")
def health_check():
    get_database().execute("SELECT 1").fetchone()
    return jsonify({"status": "ok"})


@app.get("/api/questions")
def api_questions():
    limit_value = request.args.get("limit", "20")
    try:
        limit = 500 if limit_value == "all" else max(1, min(int(limit_value), 100))
    except ValueError:
        return jsonify({"error": "limit must be a number or 'all'"}), 400
    excluded = [int(value) for value in request.args.get("exclude", "").split(",") if value.isdigit()][:100]
    selected_topic = request.args.get("topic", "").strip()
    database = get_database()
    filters = ["is_active=1", "status='published'"]
    parameters: list[object] = []
    if selected_topic:
        filters.append("topic=?")
        parameters.append(selected_topic)
    where_clause = " AND ".join(filters)
    if excluded:
        placeholders = ",".join("?" for _ in excluded)
        rows = database.execute(
            f"""SELECT * FROM questions WHERE {where_clause}
            ORDER BY CASE WHEN id IN ({placeholders}) THEN 1 ELSE 0 END, RANDOM() LIMIT ?""",
            (*parameters, *excluded, limit),
        ).fetchall()
    else:
        rows = database.execute(
            f"SELECT * FROM questions WHERE {where_clause} ORDER BY RANDOM() LIMIT ?", (*parameters, limit)
        ).fetchall()
    return jsonify([serialize_question(row) for row in rows])


@app.post("/api/users")
def create_user():
    payload = request.get_json(silent=True) or {}
    display_name = " ".join(str(payload.get("displayName", "")).split())
    if not 2 <= len(display_name) <= 40:
        return jsonify({"error": "กรุณาใช้ชื่อ 2-40 ตัวอักษร"}), 400
    token = secrets.token_urlsafe(24)
    database = get_database()
    try:
        cursor = database.execute(
            "INSERT INTO users(display_name, team_name, access_token) VALUES (?, 'MT4', ?)",
            (display_name, token),
        )
        database.commit()
    except sqlite3.IntegrityError:
        return jsonify({"error": "ชื่อนี้มีผู้ใช้งานแล้ว กรุณาเพิ่มชื่อเล่นหรือเลขท้าย"}), 409
    return jsonify({"id": cursor.lastrowid, "displayName": display_name, "teamName": "MT4", "token": token}), 201


@app.post("/api/attempts")
def save_attempt():
    payload = request.get_json(silent=True) or {}
    token = str(payload.get("token", ""))
    database = get_database()
    user = database.execute("SELECT id FROM users WHERE access_token=?", (token,)).fetchone()
    if user is None:
        return jsonify({"error": "ไม่พบผู้ใช้งาน กรุณาลงชื่อใหม่"}), 401
    try:
        score = int(payload.get("score", 0))
        total = int(payload.get("totalQuestions", 0))
        duration = max(0, int(payload.get("durationSeconds", 0)))
    except (TypeError, ValueError):
        return jsonify({"error": "ข้อมูลผลสอบไม่ถูกต้อง"}), 400
    if total < 1 or score < 0 or score > total:
        return jsonify({"error": "คะแนนไม่ถูกต้อง"}), 400
    topic_scores = payload.get("topicScores", {})
    database.execute(
        """INSERT INTO attempts(user_id, score, total_questions, duration_seconds, selected_topic, topic_scores_json)
        VALUES (?, ?, ?, ?, ?, ?)""",
        (user["id"], score, total, duration, str(payload.get("selectedTopic", "ทุกหมวด"))[:80], json.dumps(topic_scores, ensure_ascii=False)),
    )
    database.commit()
    return jsonify({"saved": True}), 201


@app.get("/api/leaderboard")
def leaderboard():
    rows = get_database().execute(
        """SELECT u.display_name, u.team_name, COUNT(a.id) AS attempts,
        MAX(ROUND(a.score * 100.0 / a.total_questions)) AS best_score,
        ROUND(AVG(a.score * 100.0 / a.total_questions)) AS average_score
        FROM users u JOIN attempts a ON a.user_id=u.id
        GROUP BY u.id ORDER BY best_score DESC, average_score DESC, attempts DESC, u.display_name LIMIT 10"""
    ).fetchall()
    return jsonify([dict(row) for row in rows])


@app.post("/api/admin/login")
def admin_login():
    payload = request.get_json(silent=True) or {}
    username = str(payload.get("username", "")).strip()[:80]
    password = str(payload.get("password", ""))
    database = get_database()
    forwarded = request.headers.get("X-Forwarded-For", "")
    client_ip = (forwarded.split(",")[0].strip() or request.remote_addr or "unknown")[:64]
    throttle_key = f"{client_ip}|{username.casefold()}"[:180]
    throttle = database.execute("SELECT * FROM login_throttle WHERE throttle_key=?", (throttle_key,)).fetchone()
    now_epoch = int(time.time())
    if throttle and throttle["blocked_until"] > now_epoch:
        return jsonify({"error": "เข้าสู่ระบบผิดหลายครั้ง กรุณารอ 15 นาทีแล้วลองใหม่"}), 429
    admin = database.execute("SELECT * FROM admin_users WHERE username=? AND is_active=1", (username,)).fetchone()
    if admin is None or not check_password_hash(admin["password_hash"], password):
        failure_count = (throttle["failure_count"] if throttle else 0) + 1
        blocked_until = now_epoch + 900 if failure_count >= 5 else 0
        database.execute(
            """INSERT INTO login_throttle(throttle_key, failure_count, blocked_until, updated_at)
            VALUES (?, ?, ?, ?) ON CONFLICT(throttle_key) DO UPDATE SET
            failure_count=excluded.failure_count, blocked_until=excluded.blocked_until, updated_at=excluded.updated_at""",
            (throttle_key, failure_count, blocked_until, utc_now()),
        )
        database.commit()
        return jsonify({"error": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"}), 401
    database.execute("DELETE FROM login_throttle WHERE throttle_key=?", (throttle_key,))
    session.clear()
    session.permanent = True
    session["admin_user_id"] = admin["id"]
    session["csrf_token"] = secrets.token_urlsafe(24)
    database.execute("UPDATE admin_users SET last_login_at=?, updated_at=? WHERE id=?", (utc_now(), utc_now(), admin["id"]))
    g.admin_user = admin
    record_audit("login", "admin_user", admin["id"])
    database.commit()
    return jsonify({
        "user": {"id": admin["id"], "username": admin["username"], "displayName": admin["display_name"], "role": admin["role"]},
        "csrfToken": session["csrf_token"],
    })


@app.get("/api/admin/setup-status")
def admin_setup_status():
    configured = get_database().execute("SELECT 1 FROM admin_users WHERE is_active=1 LIMIT 1").fetchone() is not None
    return jsonify({"configured": configured, "persistentStorage": not str(DATABASE_PATH).startswith("/tmp/")})


@app.post("/api/admin/logout")
@require_admin()
def admin_logout():
    record_audit("logout", "admin_user", g.admin_user["id"])
    get_database().commit()
    session.clear()
    return jsonify({"loggedOut": True})


@app.get("/api/admin/me")
@require_admin()
def admin_me():
    admin = g.admin_user
    return jsonify({
        "user": {"id": admin["id"], "username": admin["username"], "displayName": admin["display_name"], "role": admin["role"]},
        "csrfToken": session["csrf_token"],
    })


@app.get("/api/admin/dashboard")
@require_admin()
def admin_dashboard():
    database = get_database()
    counts = {row["status"]: row["count"] for row in database.execute(
        "SELECT status, COUNT(*) AS count FROM questions GROUP BY status"
    ).fetchall()}
    counts["total"] = sum(counts.values())
    counts["admins"] = database.execute("SELECT COUNT(*) AS count FROM admin_users WHERE is_active=1").fetchone()["count"]
    return jsonify(counts)


ADMIN_QUESTION_SELECT = """SELECT q.*, creator.display_name AS creator_name, approver.display_name AS approver_name
FROM questions q
LEFT JOIN admin_users creator ON creator.id=q.created_by
LEFT JOIN admin_users approver ON approver.id=q.approved_by"""


@app.get("/api/admin/questions")
@require_admin()
def admin_questions():
    status = request.args.get("status", "").strip()
    topic = request.args.get("topic", "").strip()
    search = request.args.get("search", "").strip()[:200]
    filters = ["1=1"]
    parameters: list[object] = []
    if status in QUESTION_STATUSES:
        filters.append("q.status=?")
        parameters.append(status)
    if topic:
        filters.append("q.topic=?")
        parameters.append(topic)
    if search:
        filters.append("(q.question_text LIKE ? OR q.explanation LIKE ?)")
        parameters.extend([f"%{search}%", f"%{search}%"])
    rows = get_database().execute(
        f"{ADMIN_QUESTION_SELECT} WHERE {' AND '.join(filters)} ORDER BY q.updated_at DESC, q.id DESC LIMIT 500",
        parameters,
    ).fetchall()
    return jsonify([serialize_admin_question(row) for row in rows])


@app.get("/api/admin/questions/<int:question_id>")
@require_admin()
def admin_question_detail(question_id: int):
    row = get_database().execute(f"{ADMIN_QUESTION_SELECT} WHERE q.id=?", (question_id,)).fetchone()
    if row is None:
        return jsonify({"error": "ไม่พบข้อสอบ"}), 404
    return jsonify(serialize_admin_question(row))


@app.post("/api/admin/questions")
@require_admin()
def admin_create_question():
    cleaned, error = validate_question_payload(request.get_json(silent=True) or {})
    if error:
        return jsonify({"error": error}), 400
    database = get_database()
    duplicate = database.execute("SELECT id FROM questions WHERE question_text=?", (cleaned["q"],)).fetchone()
    if duplicate:
        return jsonify({"error": f"พบคำถามซ้ำกับข้อ {duplicate['id']}"}), 409
    next_id = database.execute("SELECT COALESCE(MAX(id), 0) + 1 AS id FROM questions").fetchone()["id"]
    now = utc_now()
    database.execute(
        """INSERT INTO questions(id, topic, question_text, options_json, correct_answer, explanation,
        status, is_active, difficulty, exam_frequency, source_title, source_url, verified_at, created_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'draft', 0, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (next_id, cleaned["topic"], cleaned["q"], json.dumps(cleaned["o"], ensure_ascii=False), cleaned["a"],
         cleaned["e"], cleaned["difficulty"], cleaned["examFrequency"], cleaned["sourceTitle"], cleaned["sourceUrl"],
         cleaned["verifiedAt"], g.admin_user["id"], now, now),
    )
    save_question_version(next_id, "created", g.admin_user["id"])
    record_audit("create", "question", next_id, {"status": "draft"})
    database.commit()
    return jsonify({"id": next_id, "status": "draft"}), 201


@app.put("/api/admin/questions/<int:question_id>")
@require_admin()
def admin_update_question(question_id: int):
    cleaned, error = validate_question_payload(request.get_json(silent=True) or {})
    if error:
        return jsonify({"error": error}), 400
    database = get_database()
    existing = database.execute("SELECT * FROM questions WHERE id=?", (question_id,)).fetchone()
    if existing is None:
        return jsonify({"error": "ไม่พบข้อสอบ"}), 404
    if existing["status"] == "pending" and g.admin_user["role"] != "admin":
        return jsonify({"error": "ข้อสอบอยู่ระหว่างตรวจ ผู้ดูแลระบบเท่านั้นที่แก้ไขได้"}), 409
    duplicate = database.execute(
        "SELECT id FROM questions WHERE question_text=? AND id<>?", (cleaned["q"], question_id)
    ).fetchone()
    if duplicate:
        return jsonify({"error": f"พบคำถามซ้ำกับข้อ {duplicate['id']}"}), 409
    # การแก้เนื้อหาใด ๆ ต้องกลับไปผ่านการตรวจใหม่เสมอ
    new_status = "draft"
    database.execute(
        """UPDATE questions SET topic=?, question_text=?, options_json=?, correct_answer=?, explanation=?,
        difficulty=?, exam_frequency=?, source_title=?, source_url=?, verified_at=?, status=?, is_active=0,
        approved_by=NULL, published_at=NULL, updated_at=? WHERE id=?""",
        (cleaned["topic"], cleaned["q"], json.dumps(cleaned["o"], ensure_ascii=False), cleaned["a"], cleaned["e"],
         cleaned["difficulty"], cleaned["examFrequency"], cleaned["sourceTitle"], cleaned["sourceUrl"],
         cleaned["verifiedAt"], new_status, utc_now(), question_id),
    )
    save_question_version(question_id, "updated", g.admin_user["id"])
    record_audit("update", "question", question_id, {"status": new_status})
    database.commit()
    return jsonify({"updated": True, "status": new_status})


@app.post("/api/admin/questions/<int:question_id>/submit")
@require_admin()
def admin_submit_question(question_id: int):
    database = get_database()
    row = database.execute("SELECT status, source_title, source_url FROM questions WHERE id=?", (question_id,)).fetchone()
    if row is None:
        return jsonify({"error": "ไม่พบข้อสอบ"}), 404
    if row["status"] != "draft":
        return jsonify({"error": "ส่งตรวจได้เฉพาะข้อสอบฉบับร่าง"}), 409
    if not row["source_title"]:
        return jsonify({"error": "กรุณาระบุแหล่งอ้างอิงก่อนส่งตรวจ"}), 400
    database.execute("UPDATE questions SET status='pending', is_active=0, updated_at=? WHERE id=?", (utc_now(), question_id))
    save_question_version(question_id, "submitted", g.admin_user["id"])
    record_audit("submit", "question", question_id)
    database.commit()
    return jsonify({"status": "pending"})


@app.post("/api/admin/questions/<int:question_id>/publish")
@require_admin("admin")
def admin_publish_question(question_id: int):
    database = get_database()
    row = database.execute("SELECT status, source_title FROM questions WHERE id=?", (question_id,)).fetchone()
    if row is None:
        return jsonify({"error": "ไม่พบข้อสอบ"}), 404
    if row["status"] != "pending":
        return jsonify({"error": "เผยแพร่ได้เฉพาะข้อสอบที่รอตรวจ"}), 409
    if not row["source_title"]:
        return jsonify({"error": "ข้อสอบยังไม่มีแหล่งอ้างอิง"}), 400
    now = utc_now()
    database.execute(
        "UPDATE questions SET status='published', is_active=1, approved_by=?, published_at=?, updated_at=? WHERE id=?",
        (g.admin_user["id"], now, now, question_id),
    )
    save_question_version(question_id, "published", g.admin_user["id"])
    record_audit("publish", "question", question_id)
    database.commit()
    return jsonify({"status": "published"})


@app.post("/api/admin/questions/<int:question_id>/reject")
@require_admin("admin")
def admin_reject_question(question_id: int):
    payload = request.get_json(silent=True) or {}
    reason = " ".join(str(payload.get("reason", "")).split())[:500]
    if len(reason) < 5:
        return jsonify({"error": "กรุณาระบุเหตุผลที่ส่งกลับให้แก้ไข"}), 400
    database = get_database()
    row = database.execute("SELECT status FROM questions WHERE id=?", (question_id,)).fetchone()
    if row is None:
        return jsonify({"error": "ไม่พบข้อสอบ"}), 404
    if row["status"] != "pending":
        return jsonify({"error": "ส่งกลับได้เฉพาะข้อสอบที่รอตรวจ"}), 409
    database.execute("UPDATE questions SET status='draft', is_active=0, updated_at=? WHERE id=?", (utc_now(), question_id))
    save_question_version(question_id, "rejected", g.admin_user["id"])
    record_audit("reject", "question", question_id, {"reason": reason})
    database.commit()
    return jsonify({"status": "draft"})


@app.post("/api/admin/questions/<int:question_id>/pause")
@require_admin("admin")
def admin_pause_question(question_id: int):
    database = get_database()
    row = database.execute("SELECT status FROM questions WHERE id=?", (question_id,)).fetchone()
    if row is None:
        return jsonify({"error": "ไม่พบข้อสอบ"}), 404
    if row["status"] != "published":
        return jsonify({"error": "ระงับได้เฉพาะข้อสอบที่เผยแพร่แล้ว"}), 409
    database.execute("UPDATE questions SET status='paused', is_active=0, updated_at=? WHERE id=?", (utc_now(), question_id))
    save_question_version(question_id, "paused", g.admin_user["id"])
    record_audit("pause", "question", question_id)
    database.commit()
    return jsonify({"status": "paused"})


@app.post("/api/admin/questions/<int:question_id>/restore")
@require_admin("admin")
def admin_restore_question(question_id: int):
    database = get_database()
    row = database.execute("SELECT status FROM questions WHERE id=?", (question_id,)).fetchone()
    if row is None:
        return jsonify({"error": "ไม่พบข้อสอบ"}), 404
    if row["status"] != "paused":
        return jsonify({"error": "กู้คืนได้เฉพาะข้อสอบที่ถูกระงับ"}), 409
    now = utc_now()
    database.execute(
        "UPDATE questions SET status='published', is_active=1, approved_by=?, published_at=COALESCE(published_at, ?), updated_at=? WHERE id=?",
        (g.admin_user["id"], now, now, question_id),
    )
    save_question_version(question_id, "restored", g.admin_user["id"])
    record_audit("restore", "question", question_id)
    database.commit()
    return jsonify({"status": "published"})


@app.get("/api/admin/questions/<int:question_id>/versions")
@require_admin()
def admin_question_versions(question_id: int):
    rows = get_database().execute(
        """SELECT v.id, v.version_number, v.action, v.snapshot_json, v.created_at, a.display_name AS changed_by
        FROM question_versions v LEFT JOIN admin_users a ON a.id=v.changed_by
        WHERE v.question_id=? ORDER BY v.version_number DESC""", (question_id,)
    ).fetchall()
    return jsonify([{
        "id": row["id"], "version": row["version_number"], "action": row["action"],
        "snapshot": json.loads(row["snapshot_json"]), "createdAt": row["created_at"], "changedBy": row["changed_by"],
    } for row in rows])


@app.get("/api/admin/audit-logs")
@require_admin("admin")
def admin_audit_logs():
    rows = get_database().execute(
        """SELECT l.*, a.display_name FROM audit_logs l LEFT JOIN admin_users a ON a.id=l.admin_user_id
        ORDER BY l.id DESC LIMIT 200"""
    ).fetchall()
    return jsonify([{
        "id": row["id"], "action": row["action"], "entityType": row["entity_type"],
        "entityId": row["entity_id"], "details": json.loads(row["details_json"]),
        "adminName": row["display_name"] or "ระบบ", "createdAt": row["created_at"],
    } for row in rows])


@app.get("/api/admin/users")
@require_admin("admin")
def admin_users():
    rows = get_database().execute(
        "SELECT id, username, display_name, role, is_active, created_at, last_login_at FROM admin_users ORDER BY id"
    ).fetchall()
    return jsonify([dict(row) for row in rows])


@app.post("/api/admin/users")
@require_admin("admin")
def admin_create_user():
    payload = request.get_json(silent=True) or {}
    username = str(payload.get("username", "")).strip()[:80]
    display_name = " ".join(str(payload.get("displayName", "")).split())[:120]
    password = str(payload.get("password", ""))
    role = str(payload.get("role", "head"))
    if not re.fullmatch(r"[A-Za-z0-9._-]{4,80}", username):
        return jsonify({"error": "ชื่อผู้ใช้ต้องมี 4 ตัวขึ้นไป และใช้ตัวอักษรอังกฤษ ตัวเลข จุด ขีดกลาง หรือขีดล่าง"}), 400
    if len(display_name) < 2 or len(password) < 12 or role not in ADMIN_ROLES:
        return jsonify({"error": "กรุณากรอกชื่อ รหัสผ่านอย่างน้อย 12 ตัว และบทบาทให้ถูกต้อง"}), 400
    database = get_database()
    try:
        cursor = database.execute(
            "INSERT INTO admin_users(username, password_hash, display_name, role) VALUES (?, ?, ?, ?)",
            (username, generate_password_hash(password), display_name, role),
        )
    except sqlite3.IntegrityError:
        return jsonify({"error": "ชื่อผู้ใช้นี้มีอยู่แล้ว"}), 409
    record_audit("create", "admin_user", cursor.lastrowid, {"role": role, "displayName": display_name})
    database.commit()
    return jsonify({"id": cursor.lastrowid}), 201


@app.get("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/admin")
def admin_index():
    return send_from_directory(BASE_DIR, "admin.html")


@app.get("/<path:filename>")
def static_files(filename: str):
    if filename not in {"app.js", "styles.css", "admin.js", "admin.css", "favicon.ico", "assets/mt4-heart-logo.png", "assets/team-community-logo.png", "assets/one-team-logo.png"}:
        return jsonify({"error": "not found"}), 404
    return send_from_directory(BASE_DIR, filename)


with app.app_context():
    initialize_database()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
