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
    <div>
      <p className="title">Student Login</p>
      
      <td width="20%"> <table cellPadding="0" width="400px" height="100%" align="center"> 
        <br/> <br/> <br/> <br/> <br/>
        <tr> <td> 
          <div style={{center: true, width: '100%'}}>
            <form onSubmit={handleLogin} style={{height: '165px'}}>
              Username: <input type="text" id="usr" onChange={(e) => setUsername(e.target.value)}/>
              <br/> <br/>
              Password: <input type="password" id="pwd" onChange={(e) => setPassword(e.target.value)}/>
              <br/> <br/> <br/>
              <button id="login" type="submit" className="button" style={{float: 'right'}}>Login</button>
            </form>
            <br/>
            <div>
              <Link to="/create-account">Create Account</Link> | 
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </div>
        </td> </tr>
      </table> </td>
    </div>
  );
}

export default StudentLogin;