import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../images/pypiper_logo_transparent.png';

function TeacherNavBar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
    
  useEffect(() => {
    if (drawerOpen && classes.length === 0) {
      fetchClasses();
    }
  }, [drawerOpen]);

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const data = await api.get('/classes');
      setClasses(data || []);
    } catch (err) {
      console.error('Error fetching classes:', err);
    } finally {
      setLoadingClasses(false);
    }
  };

  const goTo = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  async function logout(e) {
    e.preventDefault();
    try {
      await api.get('/teacher-logout');
      navigate('/teacher-login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  const drawerContent = (
    <Box sx={{ width: 260 }}>        
      <Box sx={{ p: 2, backgroundColor: theme.palette.accent.main }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Teacher Menu
        </Typography>
      </Box>

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => goTo("/teacher-dashboard")}>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {loadingClasses ? (
          <ListItem>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          </ListItem>
        ) : classes.length > 0 ? (
          classes.map((cls) => (
            <ListItem key={cls.id} disablePadding>
              <ListItemButton onClick={() => goTo(`/classes/${cls.id}`)}>
                <ListItemText primary={cls.name} />
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText 
              primary="No classes available"
              primaryTypographyProps={{
                fontSize: '0.85rem',
                color: 'text.muted',
                fontStyle: 'italic',
              }}
            />
          </ListItem>
        )}

        <Divider sx={{ my: 1 }} />

        <ListItem disablePadding>
          <ListItemButton onClick={() => goTo("/teacher-login")}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton edge="start" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>

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

          <Box sx={{ width: 40 }} />
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
}

export default TeacherNavBar;