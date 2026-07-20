"""ตรวจความสมบูรณ์เชิงโครงสร้างของคลังข้อสอบก่อน deploy"""

from __future__ import annotations

import re
from pathlib import Path

from extra_questions import EXTRA_QUESTIONS


def read_app_questions() -> list[tuple]:
    source = Path("app.js").read_text(encoding="utf-8")
    pattern = re.compile(
        r'\{id:(\d+),topic:"([^"]+)",q:"([^"]+)",o:\[(.*?)\],a:"([^"]+)",e:"([^"]+)"\}'
    )
    rows = []
    for match in pattern.finditer(source):
        options = re.findall(r'"([^"]*)"', match.group(4))
        rows.append(
            (
                int(match.group(1)),
                match.group(2),
                match.group(3),
                options,
                match.group(5),
                match.group(6),
            )
        )
    return rows


def validate() -> None:
    rows = read_app_questions() + EXTRA_QUESTIONS
    errors: list[str] = []
    seen_ids: set[int] = set()
    seen_questions: set[str] = set()

    for question_id, topic, question, options, answer, explanation in rows:
        if question_id in seen_ids:
            errors.append(f"ข้อ {question_id}: เลขข้อซ้ำ")
        seen_ids.add(question_id)

        normalized_question = question.strip().casefold()
        if normalized_question in seen_questions:
            errors.append(f"ข้อ {question_id}: คำถามซ้ำ")
        seen_questions.add(normalized_question)

        if len(options) != 4 or len(set(options)) != 4:
            errors.append(f"ข้อ {question_id}: ต้องมีตัวเลือกไม่ซ้ำกัน 4 ตัวเลือก")
        if options.count(answer) != 1:
            errors.append(f"ข้อ {question_id}: เฉลยต้องตรงกับตัวเลือกเพียงหนึ่งรายการ")
        if not all(str(value).strip() for value in (topic, question, answer, explanation)):
            errors.append(f"ข้อ {question_id}: มีข้อมูลสำคัญว่าง")

    expected_ids = set(range(1, 121))
    if seen_ids != expected_ids:
        errors.append(f"เลขข้อไม่ครบ 1-120: {sorted(expected_ids - seen_ids)}")
    if errors:
        raise SystemExit("\n".join(errors))

    print(
        f"ผ่าน: {len(rows)} ข้อ, {len({row[1] for row in rows})} หมวด, "
        "ตัวเลือกและเฉลยถูกต้องเชิงโครงสร้าง"
    )


if __name__ == "__main__":
    validate()
