import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SkillProgress() {
  const navigate = useNavigate();
  var [progress, setProgress] = useState({
    helloWorld: 100,
    controlFlow: 100,
    lists: 80,
    loops: 40,
    functions: 10
  });
  
  useEffect(() => {
    fetch('/api/progress')
      .then(res => res.json())
      .then(data => {
        if(data.progress) setProgress(data.progress);
      })
      .catch(err => console.log('couldnt load progress'));
  }, []);
  
  return (
    <div>
      <p className="title">Python Progress</p>
      
      <td width="20%"> 
        <table width="400px" height="100%" align="center" color="white"> 
          <tbody>
          <br/><br/><br/><br/><br/>
          <tr> 
            <td height="30px" style={{borderRadius: '5px 5px 0 0'}}> 
              <div className="progress-box">
                <div className="progress-section">
                  <div className="progress-row">
                    <label>Hello World:</label>
                    <div className="progress-container">
                      <progress value={progress.helloWorld} max="100"></progress>
                      <span className="progress-text">{progress.helloWorld}%</span>
                    </div>
                  </div>

                  <div className="progress-row">
                    <label>Control Flow:</label>
                    <div className="progress-container">
                      <progress value={progress.controlFlow} max="100"></progress>
                      <span className="progress-text">{progress.controlFlow}%</span>
                    </div>
                  </div>

                  <div className="progress-row">
                    <label>Lists:</label>
                    <div className="progress-container">
                      <progress value={progress.lists} max="100"></progress>
                      <span className="progress-text">{progress.lists}%</span>
                    </div>
                  </div>

                  <div className="progress-row">
                    <label>Loops:</label>
                    <div className="progress-container">
                      <progress value={progress.loops} max="100"></progress>
                      <span className="progress-text">{progress.loops}%</span>
                    </div>
                  </div>

                  <div className="progress-row">
                    <label>Functions:</label>
                    <div className="progress-container">
                      <progress value={progress.functions} max="100"></progress>
                      <span className="progress-text">{progress.functions}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table> 
      </td>
      <a href="/menu" onClick={(e) => {e.preventDefault(); navigate('/menu')}} className="back-button">← Back</a>
    </div>
  );
}

export default SkillProgress;