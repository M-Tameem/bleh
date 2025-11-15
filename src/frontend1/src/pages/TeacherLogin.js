import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function StudentLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await api.post('/login', { username, password });
      navigate('/menu');
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
      <div style={{ width: '500px', textAlign: 'center' }}>
        <p className="title">Teacher Login</p>

        <form onSubmit={handleLogin} style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="usr">Username:</label><br />
            <input
              type="text"
              id="usr"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="pwd">Password:</label><br />
            <input
              type="password"
              id="pwd"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

            {/* DOESN'T CHECK LOGIN, NEEDS TO BE REFACTORED */}
          <form action="/teacher-dashboard">
            <button type="submit" className="button" style={{ float: 'right' }}>
                Login
            </button>
          </form>
        </form>

        <div style={{ marginTop: '2rem' }}>
          <Link to="/login">Student Login</Link> |{' '}
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
