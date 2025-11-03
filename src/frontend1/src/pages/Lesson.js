import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function Lesson() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    if (!courseId) {
      navigate('/menu');
      return;
    }
    async function fetchChapters() {
      try {
        const fetchedChapters = await api.get(`/courses/${courseId}/chapters`);
        setChapters(fetchedChapters);
        setSelectedChapter(fetchedChapters[0] || null);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
        navigate('/menu'); // i guess thisis a clean redirect
      }
    }
    fetchChapters();
  }, [courseId, navigate]);

  function viewLesson(chapterId) {
    navigate(`/course/${courseId}/chapter/${chapterId}`);
  }

  return (
    <div>
      <p className="title">Chapters</p>
       
      <table cellPadding="0" className="lesson" width="80%" height="90%" align="center" style={{backgroundColor: 'white'}}>
        <tbody>
          {chapters.map(chapter => (
            <tr key={chapter.id}>
              <td style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <p className="body">{chapter.name}</p>
                <button className="button" onClick={() => viewLesson(chapter.id)}>View Lesson</button>
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