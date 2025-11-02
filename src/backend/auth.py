from flask import Blueprint, request, session, jsonify
import json

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    with open('data/users.json') as f:
        users = json.load(f)

    user = users.get(username)

    if user and user['password'] == password:
        session['user'] = username
        session['role'] = user['role']
        if user['role'] == 'student':
            session['student_id'] = user['student_id']
        return jsonify({'message': 'Login successful'})

    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/logout')
def logout():
    session.clear()
    return jsonify({'message': 'Logout successful'})
