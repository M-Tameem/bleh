import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function Chapter() {
  const navigate = useNavigate();
  const { courseId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);

  async function resetProgress(courseId, chapterId) {
    try {
      await api.post(`/courses/${courseId}/chapters/${chapterId}/reset_progress`);
      alert('Progress for this chapter has been reset.');
    } catch (error) {
      console.error('Failed to reset progress:', error);
      alert('Failed to reset progress.');
    }
  }

  useEffect(() => {
    if (!courseId || !chapterId) {
      navigate('/menu');
      return;
    }

    async function fetchChapter() {
      try {
        const fetchedChapters = await api.get(`/courses/${courseId}/chapters`);
        const foundChapter = fetchedChapters.find(item => item.id === chapterId);

        if (!foundChapter) {
          navigate(`/course/${courseId}`);
          return;
        }

        setChapter(foundChapter);
      } catch (error) {
        console.error('Failed to fetch chapter:', error);
        navigate(`/course/${courseId}`);
      }
    }

    fetchChapter();
  }, [courseId, chapterId, navigate]);

  if (!chapter) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p className="title">{chapter.name}</p>

      <table cellPadding="0" className="lesson" width="80%" height="90%" align="center" style={{backgroundColor: 'white'}}>
        <tbody>
          <tr>
            <td>
              <p className="body">{chapter.content}</p>
              <button className="button quiz-button" onClick={() => navigate(`/quiz/${courseId}/${chapterId}`)}>Take Quiz</button>
              <button className="button" onClick={() => resetProgress(courseId, chapterId)}>Reset Progress</button>
            </td>
          </tr>
        </tbody>
      </table>

      <br/>
      <a href="#" onClick={() => navigate(`/course/${courseId}`)} className="back-button">← Back</a>
    </div>
  );
}

export default Chapter;