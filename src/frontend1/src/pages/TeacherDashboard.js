import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Box, 
  Typography,
  Container,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TeacherNavBar from '../components/TeacherNavBar';

function TeacherDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [selectClass, setSelectClass] = useState('3750');

  var name = "Jane"
  var classList = ["CIS*3750", "CIS*2750"]
  var studentRisks = "John Smith", riskReasons = "No Work Done"
  var work = "Print Function"
  var complete = 70, avg = 80, oAvg = 85
    
  async function logout(e) {
    e.preventDefault();
    try {
      await api.get('/teacher-logout');
      navigate('/teacher-login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  function handleSelectClass(e) {
    // if (selectClass) {
      e.preventDefault();
      if (selectClass === '3750') {
        navigate('/class');
      }
    // }
  }

  function printClass(work, className, studentRisks, riskReasons, complete, avg, oAvg) {
    return <Box sx={{ 
          maxWidth: '60%', 
          margin: '0 auto',
          p: 2,
          pl: 3,
          pr: 3,
          bgcolor: 'primary.main', 
          borderRadius: '16px',
          border: 3,
          borderColor: 'accent.outline', 
          opacity: 0.9,
          mb: 5,}}>
          <Typography onClick={handleSelectClass} 
            align='center' variant='body1' fontSize={"1.3rem"} fontWeight={500} 
            sx={{
              p: 0.75,
              mb: 2,
              letterSpacing: '0.5px',
              backgroundColor: 'accent.outline',
              borderRadius: '10px',
              cursor: 'pointer',
              textShadow: '0 0 5px rgba(0, 0, 0, 0.41)',
              '&:hover': {
                color: 'text.secondary',
                backgroundColor: 'secondary.main',},}}>
            {className}</Typography>

          {/* students at risk */}
          <Typography variant='body3' color='text.header' fontWeight={700}
            sx={{textShadow: '0 0 3px rgba(0, 0, 0, 0.27)',}}>
            Students at Risk</Typography>
          <Box sx={{
            display: 'flex', 
            justifyContent: 'space-between',
            mb: 3,}}>
              <Typography variant='body4' color='text.risk' align='left'>
                {studentRisks}</Typography>
              <Typography variant='body4' color='text.risk' align='right'>
                {riskReasons}</Typography></Box>

          {/* class statistic */}
          <Typography variant='body3' color='text.header' fontWeight={700}
            sx={{textShadow: '0 0 3px rgba(0, 0, 0, 0.27)',}}>
            Class Statistic</Typography>
          <Typography variant='body4'> 
            Work Assigned: {work}</Typography>
          
          {/* work assigned */}
          <Box sx={{
            display: 'flex', 
            justifyContent: 'space-between',
            mt: 2,}}>
              <Box width={'33%'} textAlign={'center'}>
                <Typography variant='body1' mb={1}>
                  Completion</Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress value={complete} />
                  <Box sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',}}>
                      <Typography variant='body1' fontSize={14}>
                        {complete}%</Typography></Box></Box></Box>
           
            {/* avg grade */}
            <Box width={'33%'} textAlign={'center'}>
              <Typography variant='body1' mb={1}>Average</Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress value={avg} />
                  <Box sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Typography variant='body1' fontSize={14}>
                      {avg}%</Typography></Box></Box></Box>
           
            {/* overall avg */}
            <Box width={'33%'} textAlign={'center'}>
              <Typography variant='body1' mb={1}>Overall Average</Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress value={oAvg} />
                  <Box sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Typography variant='body1' fontSize={14}>
                      {oAvg}%</Typography></Box></Box></Box>
          </Box>
        </Box>
  }
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}>
      <TeacherNavBar />

      <Container maxWidth="100%">
        
        {/* welcome */}
        <Box sx={{textAlign: 'center', m: 3}}>
          <Typography variant='h1' 
            sx={{mb: 2, 
              // color: 'text.header',
              textShadow: `0 5px 15px ${theme.palette.primary.main}65`,}}>
            Teacher Dashboard</Typography>
          <Typography variant='h2'>
            Welcome, {name}!</Typography></Box>

          {classList.map((className, i) => (
            printClass(work, className, studentRisks, riskReasons, complete, avg, oAvg)
          ))}
      </Container>
    </Box>
  );  
}

export default TeacherDashboard;