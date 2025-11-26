import json

from flask import Blueprint, jsonify, session

from .helpers.bkt_model import get_bkt_tracker, load_student_model
from .helpers.question_bank import build_question_bank, load_course_chapters

students_bp = Blueprint("students", __name__)


@students_bp.route("/student/<student_id>")
def student_profile(student_id):
    if "user" not in session:
        return jsonify({"error": "Not logged in"}), 401

    role = session.get("role")

    if role == "student":
        if session.get("student_id") != student_id:
            return jsonify({"error": "Forbidden"}), 403
    elif role != "teacher":
        return jsonify({"error": "Forbidden"}), 403

    with open("data/students.json") as f:
        students_data = json.load(f)

    student = students_data.get(student_id)

    if not student:
        return jsonify({"error": "Not Found"}), 404

    return jsonify(student)


@students_bp.route("/student/progress", methods=["GET"])
def get_student_progress():
    """Get comprehensive progress for the logged-in student across all courses"""
    if "user" not in session:
        return jsonify({"error": "Not logged in"}), 401

    user_id = session["user"]

    try:
        with open("data/courses.json") as f:
            courses = json.load(f)
    except FileNotFoundError:
        return jsonify({"error": "Courses not found"}), 404

    progress_data = {}
    model_data = load_student_model(user_id)
    mastery = model_data.get("mastery", {})
    threshold = get_bkt_tracker().get_mastery_threshold()

    for course in courses:
        course_id = course["id"]

        chapters = load_course_chapters(course_id)
        if not chapters:
            continue

        course_progress = {}

        for chapter in chapters:
            chapter_id = chapter["id"]
            try:
                _, _, chapter_skills = build_question_bank(course_id, chapter_id)
            except (FileNotFoundError, ValueError):
                chapter_title = chapter.get("name", chapter.get("title", "Untitled"))
                course_progress[chapter_id] = {
                    "title": chapter_title,
                    "percentage": 0,
                    "mastered_skills": 0,
                    "total_skills": 0,
                }
                continue

            total_skills = len(chapter_skills)
            mastered_count = sum(
                1
                for skill_id in chapter_skills
                if mastery.get(skill_id, 0) >= threshold
            )
            percentage = (
                round((mastered_count / total_skills * 100), 1)
                if total_skills > 0
                else 0
            )
            course_progress[chapter_id] = {
                "title": chapter.get("name", chapter.get("title", "Untitled")),
                "percentage": percentage,
                "mastered_skills": mastered_count,
                "total_skills": total_skills,
            }

        if course_progress:
            progress_data[course_id] = course_progress

    return jsonify(progress_data)
