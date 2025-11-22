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
    <AppBar
      position="static"
      sx={{
        borderBottom: '2px solid #013600',
        height: 45,
      }}>
      <Toolbar disableGutters
        sx={{
          minHeight: '0 !important',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 1,
          paddingRight: 1, 
        }}>

        {/* even out bar */}
        <Box></Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img 
            src={logo} 
            alt="PyPiper Logo" 
            style={{ height: '30px', width: 'auto' }} />
            <Typography variant="h3" sx={{ fontWeight: 600, }}>
              PyPiper</Typography></Box>
        
        <Box onClick={logout} 
          sx={{cursor: 'pointer',
            '&:hover': {
              opacity: 0.7,}}}>
          <Avatar
            alt='Logout'
            src={exitIcon}
            variant="square"
            sx={{width: 17, height: 'auto', background: 'transparent'}}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TeacherNavBar;