import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import StudentLogin from './pages/StudentLogin';
import StudentMenu from './pages/StudentMenu';
import CreateAccount from './pages/CreateAccount';
import ForgotPassword from './pages/ForgotPassword';
import ChatPy from './pages/ChatPy';
import Docs from './pages/Docs';
import Lesson from './pages/Lesson';
import Quiz from './pages/Quiz';
import SkillProgress from './pages/SkillProgress';
import TeacherLogin from './pages/TeacherLogin';
import TeacherDashboard from './pages/TeacherDashboard';
import Class from './pages/Class';

import NavBar from './NavBar';
import ShowNavBar from './ShowNavBar';

function App() {
  return (
    <Router>
      <ShowNavBar>
        <NavBar />
      </ShowNavBar>

      <Routes>
        <Route path="/" element={<StudentLogin />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/menu" element={<StudentMenu />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/chat" element={<ChatPy />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/course/:courseId" element={<Lesson />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/:courseId/:chapterId" element={<Quiz />} />
        <Route path="/progress" element={<SkillProgress />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/class" element={<Class />} />
      </Routes>
    </Router>
  );
}

export default App;