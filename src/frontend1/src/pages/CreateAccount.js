import React from 'react';
import { useNavigate } from 'react-router-dom';

function CreateAccount() {
  const navigate = useNavigate();
  var email, username, password, confirmPassword;
  
  function submitForm(e) {
    e.preventDefault();
    if(password == confirmPassword) {
      console.log('creating account');
      navigate('/login');
    } else {
      alert('passwords dont match!');
    }
  }
  
  function goBack() {
    navigate('/login');
  }
  
  return (
    <div>
      <p className="title">Create Account</p>
      
      <td width="20%"> 
        <table width="400px" height="100%" align="center" color="white"> 
          <br/><br/><br/><br/><br/>
          <tr> 
            <td height="30px" style={{borderRadius: '5px 5px 0 0'}}> 
              <div className="Login" style={{textAlign: 'center', width: '100%'}}>
                <form action="/api/createAccount" method="post" onSubmit={submitForm}>
                  <label htmlFor="email">Email:</label><br/>
                  <input type="text" id="fullname" name="fullname" required onChange={e => email = e.target.value}/><br/><br/>

                  <label htmlFor="username">Username:</label><br/>
                  <input type="text" id="username" name="username" required onChange={e => username = e.target.value}/><br/><br/>

                  <label htmlFor="password">Password:</label><br/>
                  <input type="text" id="email" name="email" required onChange={e => password = e.target.value}/><br/><br/>

                  <label htmlFor="confirmation">Confirm Password:</label><br/>
                  <input type="text" id="password" name="password" required onChange={e => confirmPassword = e.target.value}/><br/><br/>

                  <button type="submit" className="button">Create Account</button>
                </form>
              </div>
            </td>
          </tr>
        </table> 
      </td>
      <a href="#" onClick={goBack} className="back-button">← Back</a>
    </div>
  );
}

export default CreateAccount;