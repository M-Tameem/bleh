import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useTheme } from '@mui/material/styles';
import api from '../services/api';
import StudentNavBar from '../components/StudentNavBar'

function Chapter() {
  const navigate = useNavigate();
  const theme = useTheme();

  const { courseId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  async function resetProgress(courseId, chapterId) {
    try {
      await api.post(`/courses/${courseId}/chapters/${chapterId}/reset_progress`);
      alert('Progress for this chapter has been reset.');
    } catch (error) {
      console.error('Failed to reset progress:', error);
      alert('Failed to reset progress.');
    }
  }

  useEffect(() => {
    async function fetchChapters() {
      setLoading(true);
      try {
        const fetchedChapters = await api.get(`/courses/${courseId}/chapters`);
        setChapters(fetchedChapters);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchChapters();
  }, [courseId]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* AppBar */}
      <StudentNavBar />

      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Typography variant="h1" sx={{ mb: 4 }}>
          Python 101 Chapters
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : chapters.length === 0 ? (
          <Typography 
            variant="h5" 
            sx={{ 
              textAlign: 'center', 
              py: 8, 
              color: theme.palette.text.secondary 
            }}
          >
            No chapters available
          </Typography>
        ) : (
          <Stack spacing={3}>
            {chapters.map(chapter => (
              <Card
                key={chapter.id}
                sx={{
                  p: 2,
                  borderRadius: '20px',
                  backgroundColor: '#FAD48D',
                  transition: '0.3s',
                  '&:hover': {
                    backgroundColor: '#FAD48D',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      flexWrap: 'wrap', 
                      gap: 2 
                    }}
                  >
                    <Typography variant="h3" sx={{ color: '#2b2b2bff', flex: 1 }}>
                      {chapter.title || chapter.name}
                    </Typography>
                    
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => navigate(`/courses/${courseId}/chapters/${chapter.id}/question`)}
                        sx={{ 
                          height: '50px',
                          fontSize: '1.1rem',
                          minWidth: '150px',
                        }}
                      >
                        Start Quiz
                      </Button>

                      <Button
                        variant="outlined"
                        startIcon={<RestartAltIcon />}
                        onClick={() => resetProgress(courseId, chapter.id)}
                      >
                        Reset
                      </Button>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

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

export default Chapter;