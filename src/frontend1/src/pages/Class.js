import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Typography,
  Container,
  Button,
  Link as MuiLink,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TeacherNavBar from '../components/TeacherNavBar';

function Class() {
    const navigate = useNavigate();
    const theme = useTheme();
    var className = "CIS*3750"
    var fNames = ["John", "William", "Emma", "Olivia", "James", "Sophia", "Michael", "Isabella", "Benjamin", "Mia"]
    var lNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
    var grades = [0, 80, 88, 92, 33, 67, 45, 78, 14, 50]
    var wComplete = [0, 70, 80, 90, 20, 70, 80, 50, 70, 90]

    function print(arr, grades, percent) {
        if (percent) {
            return arr.map((item, index) => (
                <Typography key={index} mb={1}
                    sx={{ color: grades[index] < 50 ? 'text.risk' : 'body1'}}>
                    <MuiLink href='/Student' color='inherit'>
                        {item}%</MuiLink></Typography>))
        } else {
            return arr.map((item, index) => (
                <Typography key={index} mb={1}
                    sx={{ color: grades[index] < 50 ? 'text.risk' : 'body1'}}>
                    {item}</Typography>))
        }
    }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        opacity: 0.9
      }}>  
      <TeacherNavBar />

      <Container maxWidth="100%">
        {/* welcome */}
        <Box sx={{textAlign: 'center', m: 2}}>
          <Typography variant='h1' align='center' sx={{mb: 5, 
            textShadow: `0 5px 15px ${theme.palette.primary.main}65`,}}> 
            {className} Statistic </Typography></Box>

        
        <Box sx={{ 
            maxWidth: '70%', 
            margin: '0 auto', 
            p: 2,
            pl: 3,
            pr: 3,
            bgcolor: 'primary.main', 
            borderRadius: '16px',
            border: 2,
            borderColor: 'accent.outline',
            display: 'flex', 
            justifyContent: 'space-between',}}>

            {/* last names */}
            <Box width={'25%'} textAlign={'left'}>
                <Typography variant='body3' fontWeight={700} mb={1}>Last Names</Typography>
                {print(lNames, grades, false)}</Box>

            {/* first names */}
            <Box width={'25%'} textAlign={'left'}>
                <Typography variant='body3' fontWeight={700} mb={1}>First Names</Typography>
                {print(fNames, grades, false)}</Box>
            
            {/* grades */}
            <Box width={'25%'} textAlign={'center'}>
                <Typography variant='body3' fontWeight={700} mb={1}>Grades</Typography>
                {print(grades, grades, false)}</Box>
            
            {/* work completed */}
            <Box width={'25%'} textAlign={'center'}>
                <Typography variant='body3' fontWeight={700} mb={1}>Work Completed</Typography>
                {print(wComplete, grades, true)}</Box>
        </Box>

        {/* back button */}
        <Box width='100%' align="right">
            <Button
                variant="contained"
                type="submit"
                onClick={() => navigate('/teacher-dashboard')}
                color="primary"
                size="medium"
                sx={{
                    py: 1.8,
                    mt: 5,
                    mr: 2,
                    fontSize: '1.1rem',
                    width: 100,
                    height: 50}}>
                Back</Button>
        </Box>
    </Container></Box>

    );
}

export default Class;