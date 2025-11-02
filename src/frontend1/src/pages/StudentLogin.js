import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function StudentLogin() {
  const navigate = useNavigate();
  var username;
  var password;
  
  function handleLogin(e) {
    e.preventDefault();
    console.log('logging in with', username, password);
    navigate('/menu');
  }
  
  return (
    <div>
      <p className="title">Student Login</p>
      
      <td width="20%"> <table cellPadding="0" width="400px" height="100%" align="center"> 
        <br/> <br/> <br/> <br/> <br/>
        <tr> <td> 
          <div style={{center: true, width: '100%'}}>
            <form action="/api/login" onSubmit={handleLogin} style={{height: '165px'}}>
              Username: <input type="text" id="usr" onChange={(e) => username = e.target.value}/>
              <br/> <br/>
              Password: <input type="text" id="pwd" onChange={(e) => password = e.target.value}/>
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