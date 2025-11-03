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


# edit page for this later 
@auth_bp.route('/api/forgotPassword', methods=['POST'])
def forgot_password():
    username = request.form.get('fullname')

    with open('data/users.json') as f:
        users = json.load(f)

    user = users.get(username)

    if user:
        return jsonify({'message': 'Password reset process started.'})
    else:
        return jsonify({'message': 'If that account exists, a password reset has been initiated.'})

# also edit page for this
@auth_bp.route('/api/resetPassword', methods=['POST'])
def reset_password():
    data = request.get_json()
    username = data.get('username')
    new_password = data.get('newPassword')

    with open('data/users.json') as f:
        users = json.load(f)

    user = users.get(username)

    if user:
        user['password'] = new_password
        with open('data/users.json', 'w') as f:
            json.dump(users, f, indent=4)
        return jsonify({'message': 'Password reset successful.'})
    else:
        return jsonify({'message': 'If that account exists, the password has been reset.'})
