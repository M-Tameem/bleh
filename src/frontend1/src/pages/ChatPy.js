import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatPy() {
  const navigate = useNavigate();
  var [output, setOutput] = useState('PyP will answer here.');
  var [input, setInput] = useState('');
  
  function handleSubmit(e) {
    e.preventDefault();
    fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: input }),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(data => {
        setOutput(data.response || 'PyP says: ' + input);
      });
  }
  
  function nextQuestion() {
    navigate('/quiz');
  }
  
  return (
    <div>
      <p className="title">Chat with PyP</p>

      <table width="80%" height="100%" align="center">
        <tbody>
        <tr> <td>
          <div style={{center: true, width: '100%'}} height="100%">
            <form action="/api/chat" method="post" onSubmit={handleSubmit} style={{height: '400px'}}>
              <div style={{backgroundColor: 'white', width: '90%', height: '90%'}}><output id="output"> {output} </output></div>
              <input type="text" id="input" placeholder="Enter your query" style={{width: '85%'}} value={input} onChange={(e) => setInput(e.target.value)}/>
              <button id="enter" type="submit" className="button">Enter</button>
            </form>
            
            <br/><button id="next" onClick={nextQuestion} className="button" style={{float: 'right'}}>Next</button>
          </div>
        </td> </tr>
        </tbody>
      </table>
      <a href="#" onClick={() => navigate('/menu')} className="back-button">← Back</a>
    </div>
  );
}

export default ChatPy;