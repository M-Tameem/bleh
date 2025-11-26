import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AppBar,
  Toolbar,
  Box, 
  TextField, 
  Button, 
  Typography,
  Link as MuiLink,
  Container,
  Stack,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import api from '../services/api';
import LoginNavBar from '../components/LoginNavBar'

function StudentLogin() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  async function handleLogin(e) {
    e.preventDefault();
    try {
      await api.post('/login', { username, password });
      navigate('/menu');
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };
  
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <LoginNavBar />

      {/*Main Content*/}
      <Container maxWidth="sm" sx={{ pt: 3, pb: 2 }}>
        {/*Title*/}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', sm: '3rem' },
              textShadow: `0 5px 15px ${theme.palette.primary.main}65`,
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 1,
            }}
          >
            Welcome to PyPiper!
          </Typography>
        </Box>

        {/*Login Card*/}
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleLogin}>
              <Stack spacing={3}>
                
                {/*Username*/}
                <Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 1, 
                      color: 'info.main',
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    required
                    placeholder="Enter your username"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'action.hover',
                        transition: 'all 0.3s ease',
                        '& input': {
                          color: 'text.primary',
                          padding: '14px 16px',
                          fontSize: '1rem',
                        },
                        '& fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: '1px',
                        },
                        '&:hover': {
                          backgroundColor: 'action.selected',
                          '& fieldset': {
                            borderColor: 'secondary.main',
                          },
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'action.focus',
                          '& fieldset': {
                            borderColor: 'secondary.main',
                            borderWidth: '2px',
                          },
                        },
                      },
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: 'text.disabled',
                      },
                    }}
                  />
                </Box>

                {/*Password*/}
                <Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 1, 
                      color: 'info.main',
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    required
                    placeholder="Enter your password"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'action.hover',
                        transition: 'all 0.3s ease',
                        '& input': {
                          color: 'text.primary',
                          padding: '14px 16px',
                          fontSize: '1rem',
                        },
                        '& fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: '1px',
                        },
                        '&:hover': {
                          backgroundColor: 'action.selected',
                          '& fieldset': {
                            borderColor: 'secondary.main',
                          },
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'action.focus',
                          '& fieldset': {
                            borderColor: 'secondary.main',
                            borderWidth: '2px',
                          },
                        },
                      },
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: 'text.disabled',
                      },
                    }}
                  />
                </Box>

                {/*Forgot Password*/}
                <Box sx={{ textAlign: 'right' }}>
                  <MuiLink 
                    component={Link} 
                    to="/forgot-password"
                    sx={{ 
                      color: theme.palette.secondary.main,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      fontWeight: 500,
                      opacity: 0.9,
                      '&:hover': { 
                        opacity: 1,
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Forgot your password?
                  </MuiLink>
                </Box>

                {/*Sign In Button*/}
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    py: 1.8,
                    fontSize: '1.1rem',
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </form>
          </CardContent>

        <Divider 
          sx={{ 
            my: 2,
            borderColor: `${theme.palette.info.main}33`,
          }} 
        />

        {/*Footer Links*/}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ textAlign: 'center' }}
        >
          <MuiLink 
            component={Link} 
            to="/create-account"
            sx={{ 
              color: theme.palette.info.main,
              fontSize: '0.95rem',
              textDecoration: 'none',
              fontWeight: 500,
              opacity: 0.9,
              '&:hover': { 
                opacity: 1,
                textDecoration: 'underline',
              }
            }}
          >
            Create New Account
          </MuiLink>
          
          <Typography sx={{ 
            color: `${theme.palette.info.main}66`,
            display: { xs: 'none', sm: 'block' } 
          }}>
            •
          </Typography>
          
          <MuiLink 
            component={Link} 
            to="/teacher-login"
            sx={{ 
              color: theme.palette.info.main,
              fontSize: '0.95rem',
              textDecoration: 'none',
              fontWeight: 500,
              opacity: 0.9,
              '&:hover': { 
                opacity: 1,
                textDecoration: 'underline',
              }
            }}
          >
            Teacher Login Here
          </MuiLink>
        </Stack>

      </Container>
    </Box>
  );
}

export default StudentLogin;