from flask import Blueprint, jsonify, abort, session, request
import json

questions_bp = Blueprint('questions', __name__)

def get_user_progress(user_id):
    with open('src/backend/data/user_progress.json') as f:
        progress = json.load(f)
    return progress.get(user_id, {})

def update_user_progress(user_id, course_id, chapter_id, new_progress):
    with open('src/backend/data/user_progress.json', 'r+') as f:
        progress_data = json.load(f)
        if user_id not in progress_data:
            progress_data[user_id] = {}
        if course_id not in progress_data[user_id]:
            progress_data[user_id][course_id] = {}
        progress_data[user_id][course_id][chapter_id] = new_progress
        f.seek(0)
        json.dump(progress_data, f, indent=4)
        f.truncate()

@questions_bp.route('/courses/<course_id>/chapters/<chapter_id>/question', methods=['GET'])
def get_question(course_id, chapter_id):
    if 'user' not in session:
        return jsonify({'error': 'Not logged in'}), 401

    user_id = session['user']
    user_progress = get_user_progress(user_id)
    
    current_question_index = user_progress.get(course_id, {}).get(chapter_id, 0)

    with open('src/backend/data/questions.json') as f:
        all_questions = json.load(f)

    course_questions = all_questions.get(course_id, {})
    chapter_questions = course_questions.get(chapter_id, [])

    if current_question_index >= len(chapter_questions):
        return jsonify({'message': 'Chapter complete!'})

    question = chapter_questions[current_question_index]
    # Remove the answer from the question before sending it to the user
    question_to_send = question.copy()
    del question_to_send['answer']

    return jsonify(question_to_send)

@questions_bp.route('/courses/<course_id>/chapters/<chapter_id>/question', methods=['POST'])
def submit_answer(course_id, chapter_id):
    if 'user' not in session:
        return jsonify({'error': 'Not logged in'}), 401

    user_id = session['user']
    data = request.get_json()
    submitted_answer = data.get('answer')

    user_progress = get_user_progress(user_id)
    current_question_index = user_progress.get(course_id, {}).get(chapter_id, 0)

    with open('src/backend/data/questions.json') as f:
        all_questions = json.load(f)

    course_questions = all_questions.get(course_id, {})
    chapter_questions = course_questions.get(chapter_id, [])

    if current_question_index >= len(chapter_questions):
        return jsonify({'message': 'Chapter already complete!'})

    correct_answer = chapter_questions[current_question_index]['answer']

    if submitted_answer == correct_answer:
        update_user_progress(user_id, course_id, chapter_id, current_question_index + 1)
        return jsonify({'feedback': 'Correct!'})
    else:
        return jsonify({'feedback': 'Incorrect, please try again.'})
