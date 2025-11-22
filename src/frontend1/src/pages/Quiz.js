import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Typography,
  IconButton,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';
import api from '../services/api';
import logo from '../images/pypiper_logo_transparent.png';

function Quiz() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { courseId, chapterId } = useParams();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchQuestion() {
    setLoading(true);
    try {
      const fetchedQuestion = await api.get(`/courses/${courseId}/chapters/${chapterId}/question`);
      if (fetchedQuestion.message) {
        alert(fetchedQuestion.message);
        navigate(`/course/${courseId}`);
      } else {
        setQuestion(fetchedQuestion);
      }
    } catch (error) {
      console.error('Failed to fetch question:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestion();
  }, [courseId, chapterId]);

  async function checkAnswer() {
    if (!answer.trim()) return;
    
    try {
      const response = await api.post(`/courses/${courseId}/chapters/${chapterId}/question`, { answer });
      setFeedback(response.feedback);
      if (response.feedback === 'Correct!') {
        setTimeout(() => {
          setAnswer('');
          setFeedback('');
          fetchQuestion();
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* */}
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton edge="start" onClick={() => navigate(`/course/${courseId}`)}>
            <ArrowBackIcon />
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

      {/*Main Container*/}
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
        <Typography variant="h1" sx={{ mb: 3, textAlign: 'center' }}>
          Quiz
        </Typography>

        <Card
          sx={{
            p: 3,
            borderRadius: '20px',
            backgroundColor: '#FAD48D',
          }}
        >
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h2" sx={{ color: '#2b2b2bff' }}>
                {question?.text}
              </Typography>

              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter your answer here"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={feedback === 'Correct!'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: 'rgba(0,0,0,0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0,0,0,0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#39c017ff',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#2b2b2bff',
                  },
                }}
              />

              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={checkAnswer}
                disabled={!answer.trim() || feedback === 'Correct!'}
                sx={{ height: '50px', fontSize: '1.1rem' }}
              >
                Submit Answer
              </Button>

              {feedback && (
                <Alert 
                  severity={feedback === 'Correct!' ? 'success' : 'error'}
                  sx={{ 
                    borderRadius: '12px',
                    '& .MuiAlert-message': {
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }
                  }}
                >
                  {feedback}
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/course/${courseId}`)}
          >
            Back to Lessons
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Quiz;