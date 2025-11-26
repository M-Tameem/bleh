import React from 'react';
import api from '../services/api';
import { AppBar, Toolbar, Typography, Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import logo from '../images/pypiper_logo_transparent.png';
import exitIcon from '../images/logout.png';

function TeacherNavBar() {
  const navigate = useNavigate();
  const theme = useTheme();
    
  async function logout(e) {
    e.preventDefault();
    try {
      await api.get('/logout');
      navigate('/teacher-login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
        <AppBar position="static" color="primary">
          <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img 
                src={logo} 
                alt="PyPiper Logo" 
                style={{ height: '40px', width: 'auto' }}
              />
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                PyPiper
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
  );
}

export default TeacherNavBar;