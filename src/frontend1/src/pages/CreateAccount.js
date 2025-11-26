import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Typography,
  Container,
  Stack,
  TextField,
  Button,
  Divider,
  Link as MuiLink,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LoginNavBar from '../components/LoginNavBar'

function CreateAccount() {
  const navigate = useNavigate();
  const theme = useTheme();
  var email, username, password, confirmPassword;
  
  function submitForm(e) {
    e.preventDefault();
    if(password == confirmPassword) {
      console.log('creating account');
      navigate('/login');
    } else {
      alert('passwords dont match!');
    }
  }
  
  function goBack() {
    navigate('/');
  }
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        mb: 5,
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}
    >
    
      <LoginNavBar />

      <Container width='sm'>
        {/*Title*/}
        <Box 
          sx={{
            textAlign: 'center', 
            mb: 3, 
            mt: 3
          }}
        >
          <Typography 
            variant="h1" 
            sx={{textShadow: `0 5px 15px ${theme.palette.primary.main}65` }}
          >
            Create Account
          </Typography>
        </Box>

        {/* create account form */}
        <Box 
          sx={{
            textAlign: 'left', 
            maxWidth: '450px', 
            margin: '0 auto'
          }}
        >
          <form 
            action="/api/createAccount" 
            method="post" 
            onSubmit={submitForm}
          >
            <Stack spacing={3}>

              {/* email */}
              <Box>
                <Typography 
                  variant="h3" 
                  fontSize={20} 
                  sx={{ 
                    mb: 1, 
                    color: 'info.main', 
                  }}
                >
                  Email
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={e => email = e.target.value}
                  required
                  placeholder="Enter your email"
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
                    }, '& .MuiOutlinedInput-input::placeholder': {
                        color: 'text.disabled',
                      },
                  }} 
                />
              </Box>

              {/* username */}
              <Box>
                <Typography 
                  variant="h3" 
                  fontSize={20} 
                  sx={{ 
                    mb: 1, 
                    color: 'info.main',
                  }}
                >
                  Username
                </Typography>
                <TextField
                  variant="outlined"
                  onChange={e => username = e.target.value}
                  required
                  fullWidth
                  value={username}
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

              {/* password */}
              <Box>
                <Typography 
                  variant="h3" 
                  fontSize={20} 
                  sx={{ 
                    mb: 1, 
                    color: 'info.main', 
                  }}
                >
                  Password
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={e => password = e.target.value}
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

              {/* confirm password */}
              <Box>
                <Typography 
                  variant="h3" 
                  fontSize={20} 
                  sx={{ 
                    mb: 1, 
                    color: 'info.main', 
                  }}
                >
                  Confirm Password
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={confirmPassword}
                  onChange={e => confirmPassword = e.target.value}
                  required
                  placeholder="Enter your password again"
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
                    
              {/* submit button */}
              <Box sx={{textAlign: 'center'}}>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  color="primary"
                  size="large"
                  sx={{
                    py: 1.8,
                    fontSize: '1.1rem',
                    mt: 1,
                  }}
                >
                  Create Account
                </Button>
              </Box>
            </Stack>
          </form>

          <Divider 
            sx={{ 
              my: 4,
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
              to="/"
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
              Student Login
            </MuiLink>
                            
            <Typography 
              sx={{ 
                color: `${theme.palette.info.main}66`,
                display: { xs: 'none', sm: 'block' } 
              }}
            >
              •
            </Typography>
                            
            <MuiLink 
              component={Link} 
              to="/forgot-password"
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
              Forgot Password
            </MuiLink>
          </Stack>

        </Box>
              
      </Container>
    </Box>
  );
}

export default CreateAccount;