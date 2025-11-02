from flask import Blueprint, jsonify, abort
import json

chapters_bp = Blueprint('chapters', __name__)

@chapters_bp.route('/courses/<course_id>/chapters', methods=['GET'])
def get_chapters(course_id):
    with open('data/chapters.json') as f:
        all_chapters = json.load(f)
    
    chapters = all_chapters.get(course_id)
    
    if not chapters:
        abort(404) # Course not found
        
    return jsonify(chapters)
