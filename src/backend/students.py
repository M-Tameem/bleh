from flask import Blueprint, session, jsonify
import json

students_bp = Blueprint('students', __name__)

@students_bp.route('/student/<student_id>')
def student_profile(student_id):
    if 'user' not in session:
        return jsonify({'error': 'Not logged in'}), 401

    role = session.get('role')

    if role == 'student':
        if session.get('student_id') != student_id:
            return jsonify({'error': 'Forbidden'}), 403
    elif role != 'teacher':
        return jsonify({'error': 'Forbidden'}), 403

    with open('src/backend/data/students.json') as f:
        students_data = json.load(f)

    student = students_data.get(student_id)

    if not student:
        return jsonify({'error': 'Not Found'}), 404

    return jsonify(student)
