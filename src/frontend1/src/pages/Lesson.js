import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function Lesson() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    async function fetchChapters() {
      try {
        const fetchedChapters = await api.get(`/courses/${courseId}/chapters`);
        setChapters(fetchedChapters);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      }
    }
    fetchChapters();
  }, [courseId]);

  return (
    <div>
      <p className="title">Chapters</p>
       
      <table cellPadding="0" className="lesson" width="80%" height="90%" align="center" style={{backgroundColor: 'white'}}>
        <tbody>
          {chapters.map(chapter => (
            <tr key={chapter.id}>
              <td style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <p className="body">{chapter.name}</p>
                <button className="button quiz-button" onClick={() => navigate(`/quiz/${courseId}/${chapter.id}`)}>Take Quiz</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br/>
      <a href="#" onClick={() => navigate('/menu')} className="back-button">← Back</a>
    </div>
  );
}

export default Lesson;