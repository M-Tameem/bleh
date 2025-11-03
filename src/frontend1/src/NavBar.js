import React from 'react';
import './App.css';

const NavBar = () => {

    return (
        <nav className="navbar">
            <table className="navBar">
                <div className="navbar" width="100%">
                    <a href="/menu" className="nav-btn"> Home</a>
                    <a href="/lesson" className="nav-btn"> Lessons</a>
                    <a href="/progress" className="nav-btn"> Progress</a>
                    <a href="/chat/:courseId/:chapterId" className="nav-btn"> Chat PyP</a>
                    <a href="/docs" className="nav-btn"> Docs</a>
                </div>
            </table>
        </nav>
    );
}

export default NavBar;