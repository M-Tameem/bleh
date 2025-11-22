from flask import Blueprint, jsonify, abort, session, request
import json
from .helpers.code_executor import execute_code

questions_bp = Blueprint('questions', __name__)

def get_user_progress(user_id):
    with open('data/user_progress.json') as f:
        progress = json.load(f)
    return progress.get(user_id, {})

def update_user_progress(user_id, course_id, chapter_id, new_progress):
    with open('data/user_progress.json', 'r+') as f:
        progress_data = json.load(f)
        if user_id not in progress_data:
            progress_data[user_id] = {}
        if course_id not in progress_data[user_id]:
            progress_data[user_id][course_id] = {}
        progress_data[user_id][course_id][chapter_id] = new_progress
        f.seek(0)
        json.dump(progress_data, f, indent=4)
        f.truncate()

def update_attempt_history(user_id, course_id, chapter_id, question_index, attempt_data):
    """Track all attempts for analytics"""
    try:
        with open('data/attempt_history.json', 'r') as f:
            history = json.load(f)
    except FileNotFoundError:
        history = {}
    
    if user_id not in history:
        history[user_id] = {}
    if course_id not in history[user_id]:
        history[user_id][course_id] = {}
    if chapter_id not in history[user_id][course_id]:
        history[user_id][course_id][chapter_id] = []
    
    from datetime import datetime
    attempt_data['timestamp'] = datetime.now().isoformat()
    attempt_data['question_index'] = question_index
    
    history[user_id][course_id][chapter_id].append(attempt_data)
    
    with open('data/attempt_history.json', 'w') as f:
        json.dump(history, f, indent=4)

def get_total_questions(course_id, chapter_id):
    """Get total number of questions in a chapter"""
    with open('data/questions.json') as f:
        all_questions = json.load(f)
    course_questions = all_questions.get(course_id, {})
    chapter_questions = course_questions.get(chapter_id, [])
    return len(chapter_questions)

@questions_bp.route('/courses/<course_id>/chapters/<chapter_id>/progress', methods=['GET'])
def get_chapter_progress(course_id, chapter_id):
    """Get progress info for a chapter"""
    if 'user' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    user_id = session['user']
    user_progress = get_user_progress(user_id)
    current_question_index = user_progress.get(course_id, {}).get(chapter_id, 0)
    total_questions = get_total_questions(course_id, chapter_id)
    
    is_complete = current_question_index >= total_questions
    progress_percentage = (current_question_index / total_questions * 100) if total_questions > 0 else 0
    
    return jsonify({
        'current_question': current_question_index,
        'total_questions': total_questions,
        'is_complete': is_complete,
        'progress_percentage': round(progress_percentage, 1)
    })

@questions_bp.route('/courses/<course_id>/chapters/<chapter_id>/question', methods=['GET'])
def get_question(course_id, chapter_id):
    if 'user' not in session:
        return jsonify({'error': 'Not logged in'}), 401

    user_id = session['user']
    user_progress = get_user_progress(user_id)
    current_question_index = user_progress.get(course_id, {}).get(chapter_id, 0)

    with open('data/questions.json') as f:
        all_questions = json.load(f)

    course_questions = all_questions.get(course_id, {})
    chapter_questions = course_questions.get(chapter_id, [])
    total_questions = len(chapter_questions)

    # If completed, show completion message with option to retake
    if current_question_index >= total_questions:
        return jsonify({
            'message': 'Chapter complete!',
            'is_complete': True,
            'current_question': current_question_index,
            'total_questions': total_questions,
            'progress_percentage': 100
        })

    question = chapter_questions[current_question_index]
    # Remove the answer from the question before sending it to the user
    question_to_send = question.copy()
    
    # Only delete 'answer' if it exists (for multiple choice questions)
    if 'answer' in question_to_send:
        del question_to_send['answer']
    
    # Don't send test_cases to frontend for code questions (prevents cheating)
    if 'test_cases' in question_to_send:
        # Just tell them how many tests there are, not what they are
        question_to_send['num_tests'] = len(question_to_send['test_cases'])
        del question_to_send['test_cases']
    
    # Add progress metadata
    question_to_send['current_question'] = current_question_index + 1
    question_to_send['total_questions'] = total_questions
    question_to_send['progress_percentage'] = round((current_question_index / total_questions * 100), 1) if total_questions > 0 else 0

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

    with open('data/questions.json') as f:
        all_questions = json.load(f)

    course_questions = all_questions.get(course_id, {})
    chapter_questions = course_questions.get(chapter_id, [])

    if current_question_index >= len(chapter_questions):
        return jsonify({'message': 'Chapter already complete!', 'is_complete': True})

    question = chapter_questions[current_question_index]
    
    # Handle code questions
    if question.get('type') == 'code':
        test_cases = question.get('test_cases', [])
        execution_result = execute_code(submitted_answer, test_cases)
        
        # Store attempt in progress tracking
        update_attempt_history(user_id, course_id, chapter_id, current_question_index, {
            'type': 'code',
            'passed': execution_result['success'],
            'test_results': execution_result['results']
        })
        
        if execution_result['success']:
            new_progress = current_question_index + 1
            update_user_progress(user_id, course_id, chapter_id, new_progress)
            
            # Check if this was the last question
            is_complete = new_progress >= len(chapter_questions)
            
            return jsonify({
                'feedback': 'Correct! All tests passed! 🎉',
                'execution_result': execution_result,
                'is_complete': is_complete,
                'current_question': new_progress,
                'total_questions': len(chapter_questions)
            })
        else:
            return jsonify({
                'feedback': 'Some tests failed. Keep trying!',
                'execution_result': execution_result
            })
    
    # Handle multiple choice and text questions (existing logic)
    else:
        correct_answer = question.get('answer')
        if not correct_answer:
            return jsonify({'error': 'Question configuration error'}), 500
            
        is_correct = submitted_answer == correct_answer
        
        update_attempt_history(user_id, course_id, chapter_id, current_question_index, {
            'type': question.get('type', 'text'),
            'correct': is_correct
        })

        if is_correct:
            new_progress = current_question_index + 1
            update_user_progress(user_id, course_id, chapter_id, new_progress)
            
            # Check if this was the last question
            is_complete = new_progress >= len(chapter_questions)
            
            return jsonify({
                'feedback': 'Correct!',
                'is_complete': is_complete,
                'current_question': new_progress,
                'total_questions': len(chapter_questions)
            })
        else:
            return jsonify({'feedback': 'Incorrect, please try again.'})

@questions_bp.route('/courses/<course_id>/chapters/<chapter_id>/reset_progress', methods=['POST'])
def reset_progress(course_id, chapter_id):
    if 'user' not in session:
        return jsonify({'error': 'Not logged in'}), 401

    user_id = session['user']
    update_user_progress(user_id, course_id, chapter_id, 0)
    return jsonify({'message': 'Progress reset successfully'})