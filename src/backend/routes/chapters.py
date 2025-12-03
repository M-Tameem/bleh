from flask import Blueprint, jsonify, abort
from .helpers.question_bank import load_course_chapters

chapters_bp = Blueprint('chapters', __name__)

@chapters_bp.route('/courses/<course_id>/chapters', methods=['GET'])
def get_chapters(course_id):
    chapters = load_course_chapters(course_id)
    
    if not chapters:
        abort(404, description="Chapters not found for this course.")
        
    return jsonify(chapters)