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
      <div style={{ width: '400px', textAlign: 'center' }}>
        <p className="title">Student Login</p>

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
              type="text"
              id="pwd"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="button">
            Login
          </button>
        </form>

        <div style={{ marginTop: '2rem' }}>
          <Link to="/create-account">Create Account</Link> |{' '}
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
