import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function TeacherDashboard() {
  const navigate = useNavigate();
  const [selectClass, setSelectClass] = useState('3750');
    
  async function logout(e) {
    e.preventDefault();
    try {
      await api.get('/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  function handleSelectClass(e) {
    if (selectClass) {
      e.preventDefault();
      if (selectClass === '3750') {
        navigate('/class');
      }
    }
  }
  
  return (
    <div>
      <p className="title">Teacher Dashboard</p>
      
      <td width="20%"> <table cellPadding="0" width="400px" height="90%" align="center"> 
        <br/> <br/> <br/> <br/> <br/>
        <tr> <td> 
          <div style={{center: true, width: '100%', textAlign: 'center'}}>
            <select id="classes" className="body" value={selectClass} onChange={(e) => setSelectClass(e.target.value)}>
                <option value="3750">CIS*3750</option>
                {/* <option value="2750">CIS*2750</option> */}
            </select>
            <br/><br/><button className="mbtn" onClick={handleSelectClass}>Select Class</button>

            <form action="/api/logout" className="btn" onSubmit={logout}>
              <button type="submit" className="mbtn">Exit</button></form>
          </div>
        </td> </tr>
      </table> </td>
    </div>
  );
}

export default TeacherDashboard;