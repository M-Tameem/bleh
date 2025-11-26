from flask import Blueprint, jsonify
import json

courses_bp = Blueprint('courses', __name__)

@courses_bp.route('/courses', methods=['GET'])
def get_courses():
    with open('data/courses.json') as f:
        courses = json.load(f)
    return jsonify(courses)
