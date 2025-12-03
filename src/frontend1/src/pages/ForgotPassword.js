import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AppBar, Toolbar, Box, TextField, Button, Typography, Container, Stack, Card, CardContent, Divider, Link as MuiLink
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LoginNavBar from '../components/LoginNavBar'

function ForgotPassword() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // still need to link to backend
    setMessage(`Password reset link sent to ${email}`);
    
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* AppBar */}
      <LoginNavBar />

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ pt: 8, pb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography 
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3rem' },
              textShadow: `0 5px 15px ${theme.palette.primary.main}65`,
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Forgot Password
          </Typography>

          <Typography sx={{ color: 'text.primary' }}>
            Enter your email to receive a password reset link
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 1, 
                    color: 'info.main', 
                    fontWeight: 600 
                  }}
                >
                  Email
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'action.hover',
                        transition: 'all 0.3s ease',
                        mb: 2,
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

              {message && (
                <Typography color="success.main" sx={{ textAlign: 'center' }}>
                  {message}
                </Typography>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ 
                  py: 1.8, 
                  fontSize: '1.1rem' 
                }}
              >
                Submit
              </Button>

            </Stack>
          </form>
        </CardContent>

        <Divider sx={{ my: 4, borderColor: `${theme.palette.info.main}33` }} />

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} justifyContent="center" 
          alignItems="center" 
          sx={{ textAlign: 'center' }}
        >
          <MuiLink 
            component={Link} 
            to="/login"
            sx={{ 
              color: theme.palette.info.main, 
              fontSize: '0.95rem', 
              textDecoration: 'none', 
              fontWeight: 500,
              opacity: 0.9, 
              '&:hover': { 
                opacity: 1, 
                textDecoration: 'underline' 
              } 
            }}
          >
            ← Back to Login
          </MuiLink>
        </Stack>
        
      </Container>
    </Box>
  );
}

export default ForgotPassword;
