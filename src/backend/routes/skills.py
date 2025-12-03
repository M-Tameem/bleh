from flask import Blueprint, jsonify

from .helpers.question_bank import load_all_question_skills

skills_bp = Blueprint("skills", __name__)


@skills_bp.route("/skills", methods=["GET"])
def get_skills():
    """Get all available skills from the question bank"""
    skills = load_all_question_skills()
    status = 200 if skills else 404
    return jsonify(skills), status
