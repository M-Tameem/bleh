import React from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();
  var email;
  
  function handleSubmit(e) {
    e.preventDefault();
    alert('Password reset sent to ' + email);
    navigate('/login');
  }
  
  return (
    <div>
      <p className="title">Forgot Password</p>
      
      <td width="20%"> 
        <table width="400px" height="100%" align="center" color="white"> 
          <br/><br/><br/><br/><br/>
          <tr> 
            <td height="30px" style={{borderRadius: '5px 5px 0 0'}}> 
              <div className="Login" style={{textAlign: 'center', width: '100%'}}>
                <form action="/api/forgotPassword" method="post" onSubmit={handleSubmit}>
                  <label htmlFor="email">Email:</label>
                  <input type="text" id="fullname" name="fullname" required onChange={e => email = e.target.value}/><br/><br/>

                  <button type="submit" className="button">Submit</button>
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

export default ForgotPassword;