import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box 
} from '@mui/material';
import logo from '../images/pypiper_logo_transparent.png';

function LoginNavBar() {
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

export default LoginNavBar;