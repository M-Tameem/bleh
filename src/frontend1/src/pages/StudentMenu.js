import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function StudentMenu() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const fetchedCourses = await api.get('/courses');
        setCourses(fetchedCourses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    }
    fetchCourses();
  }, []);

  function goToCourse(courseId) {
    navigate(`/course/${courseId}`);
  }
  
  function goToProgress(e) {
    e.preventDefault();
    navigate('/progress');
  }
  
  function goToDocs(e) {
    e.preventDefault();
    navigate('/docs');
  }
  
  async function logout(e) {
    e.preventDefault();
    try {
      await api.get('/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
  
  return (
    <div>
      <p className="title">Learn with Py Piper</p>
      
      <td width="20%"> <table cellPadding="0" width="400px" height="90%" align="center"> 
        <br/> <br/> <br/> <br/> <br/>
        <tr> <td> 
          <div style={{center: true, width: '100%', textAlign: 'center'}}>
              {courses.map(course => (
                <button key={course.id} onClick={() => goToCourse(course.id)} className="mbtn">
                  {course.name}
                </button>
              ))}
              <button onClick={goToProgress} className="mbtn">Skill Progress</button>
              <button onClick={goToDocs} className="mbtn">Docs</button>
              <button onClick={logout} className="mbtn">Exit</button>
          </div>
        </td> </tr>
      </table> </td>
    </div>
  );
}

export default StudentMenu;