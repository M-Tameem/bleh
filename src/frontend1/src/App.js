import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
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
import Classes from './pages/Classes';
import Chapter from './pages/Chapter';
import Student from './pages/Student'
import LessonView from './pages/LessonView';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {}
      <Router>
        <Routes>
          <Route path="/" element={<StudentLogin />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/menu" element={<StudentMenu />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/chat" element={<ChatPy />} />
          <Route path="/chat/:courseId/:chapterId" element={<ChatPy />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/courses/:courseId" element={<Lesson />} />
          <Route path="/courses/:courseId/chapters/:chapterId" element={<LessonView />} />
          <Route path="/courses/:courseId/chapters/:chapterId/question" element={<Quiz />} />
          <Route path="/progress" element={<SkillProgress />} />
          
          <Route path="/teacher-login" element={<TeacherLogin />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/classes/:classId" element={<Classes />} />
          <Route path="/class/student/:studentId" element={<Student />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;