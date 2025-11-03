import React from 'react';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();
  var username;
  var newPassword;

  function handleSubmit(e) {
    e.preventDefault();
    alert('Password has been reset for ' + username);
    navigate('/login');
  }

  return (
    <div>
      <p className="title">Reset Password</p>

      <td width="20%"> 
        <table width="400px" height="100%" align="center" color="white"> 
          <br/><br/><br/><br/><br/>
          <tr> 
            <td height="30px" style={{borderRadius: '5px 5px 0 0'}}> 
              <div className="Login" style={{textAlign: 'center', width: '100%'}}>
                <form action="/api/resetPassword" method="post" onSubmit={handleSubmit}>
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    onChange={e => username = e.target.value}
                  /><br/><br/>

                  <label htmlFor="newPassword">New Password:</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    required
                    onChange={e => newPassword = e.target.value}
                  /><br/><br/>

                  <button type="submit" className="button">Reset Password</button>
                </form>
              </div>
            </td>
          </tr>
        </table> 
      </td>

      <a href="#" onClick={() => navigate('/login')} className="back-button">← Back</a>
    </div>
  );
}

export default ResetPassword;
