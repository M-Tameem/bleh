"""
Questions Routes - Quiz and Question Handling
"""

import json
import random
from pathlib import Path
from datetime import datetime

from flask import Blueprint, abort, jsonify, request, session

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from models.bkt import get_bkt_model
from models.knowledge_tracing import get_knowledge_tracer

from .helpers.bkt_model import get_student_manager
from .helpers.code_executor import execute_code
from .helpers.question_bank import load_chapter_questions
from .helpers.sentiment_analyzer import detect_frustration, generate_supportive_feedback

questions_bp = Blueprint("questions", __name__)
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

DEBUG = True

# --- Helper Functions ---

def get_user_progress(user_id):
    try:
        with open(DATA_DIR / "user_progress.json") as f:
            return json.load(f).get(user_id, {})
    except FileNotFoundError:
        return {}

def update_user_progress(user_id, course_id, chapter_id, new_index):
    try:
        with open(DATA_DIR / "user_progress.json", "r+") as f:
            data = json.load(f)
            if user_id not in data: data[user_id] = {}
            if course_id not in data[user_id]: data[user_id][course_id] = {}
            current = data[user_id][course_id].get(chapter_id, 0)
            data[user_id][course_id][chapter_id] = max(current, new_index)
            f.seek(0)
            json.dump(data, f, indent=4)
            f.truncate()
    except FileNotFoundError:
        with open(DATA_DIR / "user_progress.json", "w") as f:
            json.dump({user_id: {course_id: {chapter_id: new_index}}}, f, indent=4)

def get_chapter_history(user_id, course_id, chapter_id):
    """Loads history to filter out completed questions."""
    try:
        with open(DATA_DIR / "attempt_history.json") as f:
            history = json.load(f)
        return history.get(user_id, {}).get(course_id, {}).get(chapter_id, [])
    except:
        return []

def update_attempt_history(user_id, course_id, chapter_id, question_id, attempt_data, mode="test"):
    history_path = DATA_DIR / "attempt_history.json"
    try:
        with open(history_path, "r") as f: history = json.load(f)
    except: history = {}

    if user_id not in history: history[user_id] = {}
    if course_id not in history[user_id]: history[user_id][course_id] = {}
    if chapter_id not in history[user_id][course_id]: history[user_id][course_id][chapter_id] = []

    attempt_data["timestamp"] = datetime.now().isoformat()
    attempt_data["question_id"] = str(question_id)
    attempt_data["mode"] = mode

    history[user_id][course_id][chapter_id].append(attempt_data)

    with open(history_path, "w") as f:
        json.dump(history, f, indent=4)

# --- Routes ---

@questions_bp.route("/courses/<course_id>/chapters/<chapter_id>/progress", methods=["GET"])
def get_chapter_progress(course_id, chapter_id):
    if "user" not in session: return jsonify({"error": "Not logged in"}), 401
    user_id = session["user"]
    
    manager = get_student_manager()
    bkt = get_bkt_model()

    skill_mcq = f"{course_id}:{chapter_id}:mcq"
    skill_code = f"{course_id}:{chapter_id}:code"
    
    m_mcq = manager.get_mastery(user_id, skill_mcq)
    m_code = manager.get_mastery(user_id, skill_code)
    
    return jsonify({
        "chapter_id": chapter_id,
        "overall_mastery": round((m_mcq + m_code) / 2, 4),
        "breakdown": {
            "mcq": {"mastery": round(m_mcq, 4), "is_mastered": bkt.is_mastered(m_mcq)},
            "code": {"mastery": round(m_code, 4), "is_mastered": bkt.is_mastered(m_code)}
        },
        "is_complete": bkt.is_mastered(m_mcq) and bkt.is_mastered(m_code)
    })

@questions_bp.route("/courses/<course_id>/chapters/<chapter_id>/question", methods=["GET"])
def get_question(course_id, chapter_id):
    if "user" not in session: return jsonify({"error": "Not logged in"}), 401
    user_id = session["user"]
    mode = request.args.get("mode", "test")

    try:
        questions = load_chapter_questions(course_id, chapter_id)
    except:
        return jsonify({"message": "No questions."}), 404

    if mode == "practice":
        u_prog = get_user_progress(user_id)
        current_idx = u_prog.get(course_id, {}).get(chapter_id, 0)
        
        if current_idx >= len(questions):
            manager = get_student_manager()
            return jsonify({
                "message": "Practice complete!",
                "is_complete": True,
                "mode": "practice",
                "breakdown": {
                    "mcq": round(manager.get_mastery(user_id, f"{course_id}:{chapter_id}:mcq"), 2),
                    "code": round(manager.get_mastery(user_id, f"{course_id}:{chapter_id}:code"), 2)
                }
            })
        
        question = questions[current_idx].copy()
        question["question_index"] = current_idx
        question["total_questions"] = len(questions)
        question["mode"] = "practice"
        if "answer" in question: del question["answer"]
        if "test_cases" in question: del question["test_cases"]
        return jsonify(question)

    else: # TEST MODE
        manager = get_student_manager()
        bkt = get_bkt_model()
        
        m_mcq = manager.get_mastery(user_id, f"{course_id}:{chapter_id}:mcq")
        m_code = manager.get_mastery(user_id, f"{course_id}:{chapter_id}:code")
        
        mcq_done = bkt.is_mastered(m_mcq)
        code_done = bkt.is_mastered(m_code)
        
        if mcq_done and code_done:
            return jsonify({"message": "Mastered!", "is_complete": True, "mode": "test"})
        elif mcq_done:
            target_type, target_mastery = "code", m_code
        elif code_done:
            target_type, target_mastery = "multiple_choice", m_mcq
        else:
            target_type = "multiple_choice" if m_mcq <= m_code else "code"
            target_mastery = m_mcq if m_mcq <= m_code else m_code

        kt = get_knowledge_tracer()
        history = get_chapter_history(user_id, course_id, chapter_id)
        
        # ML Selection
        selection = kt.pick_next_question(
            questions=questions,
            recent_attempts=history,
            mastery=target_mastery,
            question_type_filter=target_type
        )
        
        if not selection:
            return jsonify({"message": "No suitable questions found."})

        question = selection.question.copy()
        question["mode"] = "test"
        question["current_mastery"] = round(target_mastery, 4)
        question["target_skill"] = target_type
        
        if "answer" in question: del question["answer"]
        if "test_cases" in question: del question["test_cases"]

        return jsonify(question)

@questions_bp.route("/courses/<course_id>/chapters/<chapter_id>/skip", methods=["POST"])
def skip_question(course_id, chapter_id):
    if "user" not in session: return jsonify({"error": "Not logged in"}), 401
    user_id = session["user"]
    data = request.get_json() or {}
    qid = data.get("question_id")
    mode = data.get("mode", "test")

    print(f"[SKIP] User {user_id} skipped question {qid} in {mode} mode")

    update_attempt_history(
        user_id, course_id, chapter_id, qid,
        {"skipped": True, "correct": False}, 
        mode=mode
    )
    
    if mode == "practice":
        u_prog = get_user_progress(user_id)
        curr_idx = u_prog.get(course_id, {}).get(chapter_id, 0)
        update_user_progress(user_id, course_id, chapter_id, curr_idx + 1)
        print(f"[SKIP] Advanced practice progress from {curr_idx} to {curr_idx + 1}")
    
    return jsonify({"message": "Skipped"})

@questions_bp.route("/courses/<course_id>/chapters/<chapter_id>/question", methods=["POST"])
def submit_answer(course_id, chapter_id):
    if "user" not in session: return jsonify({"error": "Not logged in"}), 401
    user_id = session["user"]
    data = request.get_json() or {}
    
    submitted = data.get("answer")
    qid = data.get("question_id")
    mode = data.get("mode", "test")
    
    try:
        questions = load_chapter_questions(course_id, chapter_id)
        question = next((q for q in questions if str(q.get("id")) == str(qid)), None)
    except: return jsonify({"error": "Error loading questions"}), 500
    if not question: return jsonify({"error": "Question not found"}), 404
        
    is_correct = False
    exec_result = None
    feedback = ""
    sentiment = detect_frustration(submitted) if isinstance(submitted, str) else None
    
    if question.get("type") == "code":
        exec_result = execute_code(submitted, question.get("test_cases", []), question.get("function_name"))
        is_correct = exec_result["success"]
        feedback = generate_supportive_feedback(sentiment, is_correct)
    else:
        is_correct = (str(submitted).strip() == str(question.get("answer")).strip())
        feedback = generate_supportive_feedback(sentiment, is_correct)

    response = {
        "is_correct": is_correct,
        "feedback": feedback,
        "execution_result": exec_result,
        "mode": mode
    }

    if mode == "practice":
        if is_correct:
            u_prog = get_user_progress(user_id)
            curr_idx = u_prog.get(course_id, {}).get(chapter_id, 0)
            q_idx = next((i for i, q in enumerate(questions) if str(q["id"]) == str(qid)), -1)
            if q_idx == curr_idx:
                update_user_progress(user_id, course_id, chapter_id, curr_idx + 1)
    else:
        manager = get_student_manager()
        history = get_chapter_history(user_id, course_id, chapter_id)
        
        # --- THE FIX: Check for PREVIOUS SUCCESS, not failure ---
        # If they passed it before, we don't update BKT again (no farming).
        # If they failed it before, they CAN update BKT now (learning!).
        previously_passed = any(
            str(attempt.get("question_id")) == str(qid) 
            and attempt.get("correct") == True
            for attempt in history
        )
        
        skill_suffix = "mcq" if question.get("type") == "multiple_choice" else "code"
        skill_id = f"{course_id}:{chapter_id}:{skill_suffix}"

        # Update BKT if correct AND not farmed
        if is_correct and not previously_passed:
            update = manager.record_attempt(
                student_id=user_id,
                skill_id=skill_id,
                is_correct=True, 
                difficulty=question.get("difficulty", 3)
            )
            response["mastery_update"] = update
            response["is_complete"] = update["is_mastered"]
        else:
            # Just read status, don't write
            current = manager.get_mastery(user_id, skill_id)
            response["mastery_update"] = {
                "new_mastery": current,
                "is_mastered": get_bkt_model().is_mastered(current)
            }
            response["is_complete"] = response["mastery_update"]["is_mastered"]

    update_attempt_history(
        user_id, course_id, chapter_id, qid, 
        {"correct": is_correct, "type": question.get("type"), "input": submitted},
        mode=mode
    )

    return jsonify(response)

@questions_bp.route("/courses/<course_id>/chapters/<chapter_id>/reset_progress", methods=["POST"])
def reset_progress(course_id, chapter_id):
    if "user" not in session: return jsonify({"error": "Not logged in"}), 401
    user_id = session["user"]
    update_user_progress(user_id, course_id, chapter_id, 0)
    
    manager = get_student_manager()
    model = manager.load_student_model(user_id)
    skills = [f"{course_id}:{chapter_id}:mcq", f"{course_id}:{chapter_id}:code"]
    for s in skills:
        model["mastery"].pop(s, None)
        model["bkt_history"].pop(s, None)
    
    history_path = DATA_DIR / "attempt_history.json"
    try:
        with open(history_path, "r") as f: hist_data = json.load(f)
        if user_id in hist_data and course_id in hist_data[user_id]:
            hist_data[user_id][course_id][chapter_id] = []
            with open(history_path, "w") as f: json.dump(hist_data, f, indent=4)
    except: pass

    manager.save_student_model(user_id, model)
    return jsonify({"message": "Reset complete"})