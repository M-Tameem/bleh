import React from 'react';
import { useNavigate } from 'react-router-dom';

function Lesson() {
  const navigate = useNavigate();
  
  return (
    <div>
      <p className="title">Print Function</p>
       
      <table cellPadding="0" className="lesson" width="80%" height="90%" align="center" style={{backgroundColor: 'white'}}>
        <tbody>
        <tr><td width="20%">
          <p className="body"><span style={{color: 'blue'}}>print()</span> is a function that is used to print anything from 
            letters to sentences.</p>
        </td></tr>
        </tbody>
      </table>
      <br/>
      <center>
        <button className="button" onClick={() => navigate('/quiz')}>Take Quiz</button>
        <button className="button" onClick={() => navigate('/chat')} style={{marginLeft: '20px'}}>Ask PyP</button>
      </center>
      <a href="#" onClick={() => navigate('/menu')} className="back-button">← Back</a>
    </div>
  );
}

export default Lesson;