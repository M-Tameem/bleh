import os
import json
from flask import Blueprint, request, jsonify, session
from datetime import datetime

# Import question loader to get real answers for context
from .helpers.question_bank import load_chapter_questions

dialogue_bp = Blueprint('dialogue', __name__)




# --- OPENAI CONFIGURATION ---
# Try to import openai, handle missing library gracefully
try:
    from openai import OpenAI
    # WARNING: API key hardcoded for debugging purposes as per user request.
    # In a production environment, this should be loaded securely from environment variables.
    OPENAI_API_KEY_HARDCODED = ""
    client = OpenAI(api_key=OPENAI_API_KEY_HARDCODED)
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False
    print("Warning: 'openai' module not found. Chat will run in mock mode.")
except Exception as e:
    HAS_OPENAI = False
    print(f"Warning: OpenAI setup failed: {e}. API Key was hardcoded.")

@dialogue_bp.route('/dialogue/chat', methods=['POST'])
def chat():
    """Standard generic chat endpoint."""
    if 'user' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    msg = request.json.get('message', '')
    
    response_text = ""
    if HAS_OPENAI:
        try:
            system_instruction = "You are PyP, a helpful Python assistant. Keep answers concise."
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": msg}
                ],
                max_tokens=150,
                temperature=0.7
            )
            response_text = completion.choices[0].message.content
        except Exception as e:
            print(f"LLM Error during chat API call: {e}")
            response_text = "I'm having trouble connecting to my brain! (LLM Error)"
    else:
        # Fallback Mock if OpenAI not available
        response_text = f"I received: {msg}. (Connect OpenAI for real chat)"

    return jsonify({
        'response': response_text,
        'timestamp': datetime.now().isoformat(),
        'context': {}
    })

@dialogue_bp.route('/dialogue/quiz_help', methods=['POST'])
def quiz_help():
    """
    Specific endpoint for Practice Mode hints using LLM.
    Tracks attempts per question in session.
    """
    if 'user' not in session:
        return jsonify({'error': 'Not logged in'}), 401

    data = request.get_json()
    course_id = data.get('course_id')
    chapter_id = data.get('chapter_id')
    question_id = data.get('question_id')
    user_answer = data.get('user_answer', '')
    question_text = data.get('question_text', '')

    if not all([course_id, chapter_id, question_id]):
        return jsonify({'error': 'Missing data'}), 400

    # 1. Track Attempts
    if 'quiz_attempts' not in session:
        session['quiz_attempts'] = {}
    
    # Key to track this specific question's attempts
    q_key = f"{course_id}:{chapter_id}:{question_id}"
    attempts = session['quiz_attempts'].get(q_key, 0)
    
    # 2. Get Real Answer for Context
    real_answer = "Unknown"
    q_type = "quiz"
    try:
        questions = load_chapter_questions(course_id, chapter_id)
        # Find the question object
        q_obj = next((q for q in questions if str(q.get("id")) == str(question_id)), None)
        if q_obj:
            real_answer = q_obj.get('answer', 'See code')
            q_type = q_obj.get('type', 'quiz')
    except Exception as e:
        print(f"Error loading context: {e}")

    # 3. Formulate Prompt based on Attempts
    system_instruction = "You are PyP, a helpful Python tutor for beginners. Keep answers short and encouraging."
    user_prompt = ""
    
    if attempts == 0:
        # Hint 1: Concept
        user_prompt = (
            f"The student is working on this question: '{question_text}'. "
            f"The correct answer is: '{real_answer}'. "
            f"The student's current input is: '{user_answer}'. "
            "Give them a gentle HINT about the concept. Do NOT reveal the answer."
        )
    elif attempts == 1:
        # Hint 2: Stronger / Syntax
        user_prompt = (
            f"The student is still stuck on: '{question_text}'. "
            f"Correct answer: '{real_answer}'. "
            "Give a STRONGER hint, focusing on syntax or the specific function needed. "
            "Do NOT reveal the answer yet."
        )
    else:
        # Hint 3: Reveal Answer
        user_prompt = (
            f"The student has tried multiple times on: '{question_text}'. "
            f"The correct answer is: '{real_answer}'. "
            "Please reveal the answer to them and briefly explain WHY it is correct."
        )

    # 4. Call LLM
    response_text = ""
    if HAS_OPENAI:
        try:
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=150,
                temperature=0.7
            )
            response_text = completion.choices[0].message.content
        except Exception as e:
            print(f"LLM Error: {e}")
            response_text = "I'm having trouble connecting to my brain! (LLM Error)"
    else:
        # Fallback Mock if no key
        if attempts == 0:
            response_text = "Hint 1: Check the syntax carefully. (Mock Response - Set OpenAI Key)"
        elif attempts == 1:
            response_text = "Hint 2: Think about data types. (Mock Response)"
        else:
            response_text = f"The answer is {real_answer}. (Mock Response)"

    # Increment attempts
    session['quiz_attempts'][q_key] = attempts + 1
    session.modified = True

    return jsonify({
        'response': response_text,
        'attempts': attempts + 1
    })

@dialogue_bp.route('/dialogue/clear_attempts', methods=['POST'])
def clear_attempts():
    """Clears attempt history for practice mode reset."""
    if 'user' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    session['quiz_attempts'] = {}
    session.modified = True
    return jsonify({'message': 'Attempts cleared'})