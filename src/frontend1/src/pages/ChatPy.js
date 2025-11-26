import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Avatar,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import { useTheme } from "@mui/material/styles";
import logo from '../images/pypiper_logo_transparent.png';
import StudentNavBar from '../components/StudentNavBar'

function ChatPy() {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi, I\'m PyP! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    //User messages
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post('/dialogue/chat', {
        message: userMessage
      });
      
      //PyP messages
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.response || 'I received your message: ' + userMessage 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, something went wrong. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <Box 
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column' 
      }}
    >
      {/* AppBar */}
      <StudentNavBar />

      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          pt: 2, 
          pb: 2, 
          height: 'calc(100vh - 64px)', 
          overflow: 'auto' }}
        >
        <Typography variant="h1" sx={{ mb: 3 }}>
          Chat with PyP
        </Typography>

        {/*Chat Messages Container*/}
        <Paper 
          sx={{ 
            flex: 1,
            p: 3,
            borderRadius: "20px",
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: '350px',
            maxHeight: '600px',
          }}
        >
          {/*Messages*/}
          <Box 
            sx={{ 
              flex: 1, 
              overflowY: 'auto', 
              mb: 2,
              pr: 1,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#ffffff0d',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.accent.main,
                borderRadius: '4px',
              },
            }}
          >
            <Stack spacing={2}>
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                    flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: message.role === 'assistant' 
                        ? theme.palette.accent.main 
                        : theme.palette.primary.main,
                      color: '#2b2b2bff',
                    }}
                  >
                    {message.role === 'assistant' ? (
                      <img
                      src={logo}
                      alt="PyP"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain' 
                      }}
                      />
                    ) : (
                      <PersonIcon />
                    )}
                  </Avatar>
                  
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor: message.role === 'assistant' 
                        ? '#FAD48D' 
                        : '#39c017ff',
                      color: '#2b2b2bff',
                      borderRadius: '12px',
                    }}
                  >
                    <Typography 
                      sx={{ 
                        whiteSpace: 'pre-wrap', 
                        wordBreak: 'break-word', 
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {message.content}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              
              {loading && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    alignItems: 'center' 
                    }}
                  >
                  <Avatar
                    sx={{
                      backgroundColor: theme.palette.accent.main,
                      color: '#2b2b2bff',
                    }}
                  >
                  </Avatar>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                    }}
                  >
                    <CircularProgress size={20} sx={{ color: '#2b2b2bff' }} />
                  </Paper>
                </Box>
              )}
              
              <div ref={messagesEndRef} />
            </Stack>
          </Box>

          {/*Input Field*/}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              gap: 2,
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask PyP a question about Python"
              disabled={loading}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#121212',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.accent.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.accent.main,
                  },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !input.trim()}
              endIcon={<SendIcon />}
              sx={{
                borderRadius: '12px',
                px: 3,
                minWidth: '120px',
              }}
            >
              Send
            </Button>
          </Box>
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/menu')}
          >
            Back to Menu
          </Button>
        </Box>

      </Container>
    </Box>
  );
}

export default ChatPy;