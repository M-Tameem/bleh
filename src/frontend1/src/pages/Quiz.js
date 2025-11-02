import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Quiz() {
  const navigate = useNavigate();
  var [answer, setAnswer] = useState('');
  
  function checkAnswer() {
    if(answer.includes('print') && answer.includes('Hello 3750')) {
      alert('Correct!');
      navigate('/menu');
    } else {
      alert('Try again!');
    }
  }
  
  return (
    <div>
      <p className="title">Quiz</p>	
       
      <table cellPadding="20px" className="lesson" width="80%" height="90%" align="center" style={{backgroundColor: '#D7FFC9'}}>
        <tbody>
        <tr><td width="20%">
          <p className="body">Write code in python that prints "Hello 3750".</p>
          <input type="text" id="ans" placeholder="Enter your answer here" style={{marginLeft: '50px', width: '80%'}} value={answer} onChange={(e) => setAnswer(e.target.value)}/>
          <button id="enter" onClick={checkAnswer} className="button">Enter</button>
        </td></tr>
        </tbody>
      </table>
      <a href="#" onClick={() => navigate('/lesson')} className="back-button">← Back</a>	
    </div>
  );
}

export default Quiz;