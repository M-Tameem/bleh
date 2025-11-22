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

    with open('data/students.json') as f:
        students_data = json.load(f)

    student = students_data.get(student_id)

    if not student:
        return jsonify({'error': 'Not Found'}), 404

    return jsonify(student)

#Getting progress for student dashboard
@students_bp.route('/student/progress')
def get_student_progress():
    if 'user' not in session:
        return jsonify({'error': 'Not logged in'}), 401

    user_id = session.get('user')
    
    #Load user progress
    with open('data/user_progress.json') as f:
        progress_data = json.load(f)
    
    user_progress = progress_data.get(user_id, {})
    
    #Load questions to calculate percentages
    with open('data/questions.json') as f:
        all_questions = json.load(f)
    
    #Load chapters to get chapter titles
    with open('data/chapters.json') as f:
        all_chapters = json.load(f)
    
    #Calculate progress for each course and chapter
    progress_summary = {}
    for course_id, course_progress in user_progress.items():
        progress_summary[course_id] = {}
        for chapter_id, question_index in course_progress.items():
            total_questions = len(all_questions.get(course_id, {}).get(chapter_id, []))
            percentage = (question_index / total_questions * 100) if total_questions > 0 else 0
            
            #Get chapter title
            chapter_title = "Chapter"
            for chapter in all_chapters.get(course_id, []):
                if chapter['id'] == chapter_id:
                    chapter_title = chapter['title']
                    break
            
            progress_summary[course_id][chapter_id] = {
                'current_question': question_index,
                'total_questions': total_questions,
                'percentage': round(percentage, 1),
                'title': chapter_title
            }
    
    return jsonify(progress_summary)
