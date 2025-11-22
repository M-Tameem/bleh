import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AppBar, Toolbar, Box, TextField, Button, Typography, Container, Stack, Card, CardContent, Divider, Link as MuiLink
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import logo from '../images/pypiper_logo_transparent.png';

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
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src={logo} alt="PyPiper Logo" style={{ height: '40px', width: 'auto' }} />
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              PyPiper
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ pt: 8, pb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
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
            Forgot Password
          </Typography>
          <Typography sx={{ color: 'text.primary' }}>
            Enter your email to receive a password reset link
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, color: 'info.main', fontWeight: 600 }}>
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
                        '& input': { padding: '14px 16px', fontSize: '1rem', color: 'text.primary' },
                        '& fieldset': { borderColor: 'primary.main' },
                        '&:hover fieldset': { borderColor: 'secondary.main' },
                        '&.Mui-focused fieldset': { borderColor: 'secondary.main', borderWidth: 2 },
                      },
                      '& .MuiOutlinedInput-input::placeholder': { color: 'text.disabled' },
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
                  sx={{ py: 1.8, fontSize: '1.1rem' }}
                >
                  Submit
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>

        <Divider sx={{ my: 4, borderColor: `${theme.palette.info.main}33` }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center" sx={{ textAlign: 'center' }}>
          <MuiLink 
            component={Link} 
            to="/login"
            sx={{ color: theme.palette.info.main, fontSize: '0.95rem', textDecoration: 'none', fontWeight: 500,
                  opacity: 0.9, '&:hover': { opacity: 1, textDecoration: 'underline' } }}
          >
            ← Back to Login
          </MuiLink>
        </Stack>
      </Container>
    </Box>
  );
}

export default ForgotPassword;
