import React from 'react';
import { useNavigate } from 'react-router-dom';

function StudentMenu() {
  const navigate = useNavigate();
  
  function goToLessons(e) {
    e.preventDefault();
    navigate('/lesson');
  }
  
  function goToProgress(e) {
    e.preventDefault();
    navigate('/progress');
  }
  
  function goToDocs(e) {
    e.preventDefault();
    navigate('/docs');
  }
  
  function logout(e) {
    e.preventDefault();
    navigate('/login');
  }
  
  return (
    <div>
      <p className="title">Learn with Py Piper</p>
      
      <td width="20%"> <table cellPadding="0" width="400px" height="90%" align="center"> 
        <br/> <br/> <br/> <br/> <br/>
        <tr> <td> 
          <div style={{center: true, width: '100%', textAlign: 'center'}}>
            <form action="/api/lessons" className="btn" onSubmit={goToLessons}>
              <button type="submit" className="mbtn">All Lessons</button></form>
            <form action="/api/progress" className="btn" onSubmit={goToProgress}>
              <button type="submit" className="mbtn">Skill Progress</button></form>
            <form action="/api/docs" className="btn" onSubmit={goToDocs}>
              <button type="submit" className="mbtn">Docs</button></form>
            <form action="/api/logout" className="btn" onSubmit={logout}>
              <button type="submit" className="mbtn">Exit</button></form>
          </div>
        </td> </tr>
      </table> </td>
    </div>
  );
}

export default StudentMenu;