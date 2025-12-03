import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../images/pypiper_logo_transparent.png';

function StudentNavBar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { courseId } = useParams();

  const goTo = (path) => navigate(path);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => setDrawerOpen(open);
  
  const drawerContent = (
    <Box sx={{ width: 260 }}>        
      <Box sx={{ p: 2, backgroundColor: theme.palette.accent.main }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          PyPiper Menu
        </Typography>
      </Box>

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => goTo("/menu")}>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
        <ListItemButton onClick={() => goTo("/courses/python101")}>
            <ListItemText primary="Python 101 Lessons" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => goTo("/progress")}>
            <ListItemText primary="Skill Progress" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => goTo("/docs")}>
            <ListItemText primary="Docs" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => goTo("/chat")}>
            <ListItemText primary="Chat with PyP" />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        <ListItem disablePadding>
          <ListItemButton onClick={() => goTo("/login")}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between' 
          }}
        >
          <IconButton edge="start" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}
          >
            <img 
              src={logo} 
              alt="PyPiper Logo" 
              style={{ 
                height: '40px', 
                width: 'auto' 
              }}
            />
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                PyPiper
              </Typography>
          </Box>

          <Box sx={{ width: 40 }} />

        </Toolbar>
      </AppBar>
        
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {drawerContent}
        </Drawer>
    </>
  );
}

export default StudentNavBar;