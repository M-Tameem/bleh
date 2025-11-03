import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function Chapter() {
  const navigate = useNavigate();
  const { courseId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);

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