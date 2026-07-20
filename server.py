from __future__ import annotations

import json
import os
import re
import sqlite3
from pathlib import Path

from flask import Flask, g, jsonify, request, send_from_directory

from extra_questions import EXTRA_QUESTIONS

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATABASE_PATH = Path(os.environ.get("DATABASE_PATH", DATA_DIR / "exam_coach.sqlite3"))

app = Flask(__name__, static_folder=None)
app.config["JSON_AS_ASCII"] = False


def get_database() -> sqlite3.Connection:
    if "database" not in g:
        DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
        g.database = sqlite3.connect(DATABASE_PATH)
        g.database.row_factory = sqlite3.Row
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
        """
    )
    seed_rows = read_legacy_questions() + EXTRA_QUESTIONS
    database.executemany(
        """
        INSERT INTO questions(id, topic, question_text, options_json, correct_answer, explanation)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            topic=excluded.topic,
            question_text=excluded.question_text,
            options_json=excluded.options_json,
            correct_answer=excluded.correct_answer,
            explanation=excluded.explanation,
            updated_at=CURRENT_TIMESTAMP
        """,
        [(row[0], row[1], row[2], json.dumps(row[3], ensure_ascii=False), row[4], row[5]) for row in seed_rows],
    )
    database.commit()


def serialize_question(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"], "topic": row["topic"], "q": row["question_text"],
        "o": json.loads(row["options_json"]), "a": row["correct_answer"], "e": row["explanation"],
    }


@app.get("/api/meta")
def api_meta():
    row = get_database().execute(
        "SELECT COUNT(*) AS total, COUNT(DISTINCT topic) AS topics FROM questions WHERE is_active=1"
    ).fetchone()
    return jsonify({"totalQuestions": row["total"], "totalTopics": row["topics"], "examSize": 20})


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
    database = get_database()
    if excluded:
        placeholders = ",".join("?" for _ in excluded)
        rows = database.execute(
            f"""SELECT * FROM questions WHERE is_active=1
            ORDER BY CASE WHEN id IN ({placeholders}) THEN 1 ELSE 0 END, RANDOM() LIMIT ?""",
            (*excluded, limit),
        ).fetchall()
    else:
        rows = database.execute(
            "SELECT * FROM questions WHERE is_active=1 ORDER BY RANDOM() LIMIT ?", (limit,)
        ).fetchall()
    return jsonify([serialize_question(row) for row in rows])


@app.get("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/<path:filename>")
def static_files(filename: str):
    if filename not in {"app.js", "styles.css", "favicon.ico", "assets/mt4-heart-logo.webp"}:
        return jsonify({"error": "not found"}), 404
    return send_from_directory(BASE_DIR, filename)


with app.app_context():
    initialize_database()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
