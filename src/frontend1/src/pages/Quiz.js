import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function Quiz() {
  const navigate = useNavigate();
  const { courseId, chapterId } = useParams();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  function goToChat() {
    if (courseId && chapterId) {
      navigate(`/chat/${courseId}/${chapterId}`);
    } else {
      navigate('/chat');
    }
  }

  async function fetchQuestion() {
    if (!courseId || !chapterId) {
      navigate('/menu');
      return;
    }
    try {
      const fetchedQuestion = await api.get(`/courses/${courseId}/chapters/${chapterId}/question`);
      if (fetchedQuestion.message) {
        alert(fetchedQuestion.message);
        navigate(`/course/${courseId}`);
      } else {
        setQuestion(fetchedQuestion);
        setFeedback('');
      }
    } catch (error) {
      console.error('Failed to fetch question:', error);
      navigate('/menu');
    }
  }

  useEffect(() => {
    fetchQuestion();
  }, [courseId, chapterId]);

  async function checkAnswer() {
    if (!courseId || !chapterId) {
      navigate('/menu');
      return;
    }
    try {
      const response = await api.post(`/courses/${courseId}/chapters/${chapterId}/question`, { answer });
      setFeedback(response.feedback);
      if (response.feedback === 'Correct!') {
        setAnswer('');
        fetchQuestion();
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  }
  
  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p className="title">Quiz</p>	
       
      <table cellPadding="20px" className="lesson" width="80%" height="90%" align="center" style={{backgroundColor: '#D7FFC9'}}>
        <tbody>
        <tr><td width="20%">
          <p className="body">{question.question || question.text}</p>
          <textarea id="ans" placeholder="Enter your answer here" style={{marginLeft: '50px', width: '80%', height: '100px'}} value={answer} onChange={(e) => setAnswer(e.target.value)}/>
          <button id="enter" onClick={checkAnswer} className="button">Enter</button>
          {feedback && <p>{feedback}</p>}
          <button onClick={goToChat} className="button" style={{marginLeft: '50px'}}>Chat about this Quiz</button>
        </td></tr>
        </tbody>
      </table>
      <a href="#" onClick={() => navigate(`/course/${courseId}/chapter/${chapterId}`)} className="back-button">← Back</a>
    </div>
  );
}

export default Quiz;