import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Class() {
  const navigate = useNavigate();

    return (
        <table width="100%" height="100%">
            <p className='title'>Class Overview</p>
            
            <div>
                
                <table width="70%" align="center">
                    <br/><tr>
                        <th className="header">First Name</th>
                        <th className="header">Last Name</th>
                        <th className="header">Average Grades</th>
                        <th className="header">Midterm Grades</th>
                    </tr>

                    <tr>
                        <th className="text">John</th>
                        <th className="text">Doe</th>
                        <th className="text">84</th>
                        <th className="text">80</th>
                    </tr>

                    <tr>
                        <th className="text">Jane</th>
                        <th className="text">Doe</th>
                        <th className="text">87</th>
                        <th className="text">90</th>
                    </tr>

                    <tr>
                        <th className="text">Brad</th>
                        <th className="text">Smith</th>
                        <th className="text">75</th>
                        <th className="text">70</th>
                    </tr>
                </table>
            </div>

            <a href="#" onClick={() => navigate('/teacher-dashboard')} className="back-button">← Back</a>
        </table>
    );
}

export default Class;