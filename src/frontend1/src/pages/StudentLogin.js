import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography,
  Link as MuiLink,
  Container,
  Stack,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import api from '../services/api';

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
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        {/*Title*/}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              textShadow: `0 5px 15px ${theme.palette.primary.main}65`,
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 1,
            }}
          >
            Learn with PyPiper
          </Typography>
        </Box>

        {/*Login Fields*/}
        <Box sx={{ maxWidth: '450px', margin: '0 auto' }}>
          <form onSubmit={handleLogin}>
            <Stack spacing={3}>
              {/*Username*/}
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1, 
                    color: 'info.main',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  Username
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff0d',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '& input': {
                        color: '#FFFFFF',
                        padding: '14px 16px',
                        fontSize: '1rem',
                      },
                      '& fieldset': {
                        borderColor: `${theme.palette.menu.main}4D`,
                        borderWidth: '1px',
                      },
                      '&:hover': {
                        backgroundColor: '#ffffff14',
                        '& fieldset': {
                          borderColor: `${theme.palette.menu.main}80`,
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#ffffff1a',
                        '& fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: '#ffffff66',
                    },
                  }}
                />
              </Box>
              {/*Password*/}
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1, 
                    color: 'info.main',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    letterSpacing: '0.5px',
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
                  required
                  placeholder="Enter your password"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff0d',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '& input': {
                        color: '#FFFFFF',
                        padding: '14px 16px',
                        fontSize: '1rem',
                      },
                      '& fieldset': {
                        borderColor: `${theme.palette.menu.main}4D`,
                        borderWidth: '1px',
                      },
                      '&:hover': {
                        backgroundColor: '#ffffff14',
                        '& fieldset': {
                          borderColor: `${theme.palette.menu.main}80`,
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#ffffff1a',
                        '& fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: '#ffffff66',
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
                    color: `${theme.palette.secondary.main}A1`,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': { 
                      color: theme.palette.secondary.main,
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
                size="large"
                sx={{
                  py: 1.8,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  boxShadow: `0 4px 14px ${theme.palette.menu.main}4D`,
                  '&:hover': {
                    backgroundColor: 'secondary.main',
                    boxShadow: `0 6px 20px ${theme.palette.menu.main}66`,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Sign In
              </Button>
            </Stack>
          </form>
          {/*Line*/}
          <Divider 
            sx={{ 
              my: 4,
              borderColor: `${theme.palette.info.main}33`,
            }} 
          />
          {/*Footer*/}
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
                color: `${theme.palette.info.main}E6`,
                fontSize: '0.95rem',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': { 
                  color: 'info.main',
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
                color: `${theme.palette.info.main}E6`,
                fontSize: '0.95rem',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': { 
                  color: 'info.main',
                  textDecoration: 'underline',
                }
              }}
            >
              Teacher Login
            </MuiLink>
          </Stack>

          {/*Contact Support*/}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#ffffff4d',
                fontSize: '0.85rem',
              }}
            >
              Need help? Contact support
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default StudentLogin;