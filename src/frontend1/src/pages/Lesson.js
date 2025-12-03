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
  Chip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';
import api from '../services/api';
import StudentNavBar from '../components/StudentNavBar'

function Lesson() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { courseId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedChapters, setCompletedChapters] = useState(new Set());

  async function resetProgress(courseId, chapterId) {
    try {
      await api.post(`/courses/${courseId}/chapters/${chapterId}/reset_progress`);
      alert('Progress for this chapter has been reset.');
      setCompletedChapters(prev => {
        const newSet = new Set(prev);
        newSet.delete(chapterId);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to reset progress:', error);
      alert('Failed to reset progress.');
    }
  }

  async function checkChapterCompletion(chapterId) {
    try {
      // Get question in test mode
      const response = await api.get(`/courses/${courseId}/chapters/${chapterId}/question?mode=test`);
      
      // Chapter is complete?
      if (response.is_complete) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to check completion for chapter ${chapterId}:`, error);
      return false;
    }
  }

  async function fetchProgress() {
    try {
      const completionPromises = chapters.map(async (chapter) => {
        const isComplete = await checkChapterCompletion(chapter.id);
        return { chapterId: chapter.id, isComplete };
      });

      const results = await Promise.all(completionPromises);
      
      const completedSet = new Set();
      results.forEach(({ chapterId, isComplete }) => {
        if (isComplete) {
          completedSet.add(chapterId);
        }
      });
      
      setCompletedChapters(completedSet);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
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

  // Fetch progress after chapters are loaded
  useEffect(() => {
    if (chapters.length > 0) {
      fetchProgress();
    }
  }, [chapters]);

  const isChapterLocked = (index) => {
    // First chapter is always unlocked
    if (index === 0) return false;
    
    // Check if all previous chapters are completed
    for (let i = 0; i < index; i++) {
      const previousChapter = chapters[i].id;
      
      if (!completedChapters.has(previousChapter)) {
        return true;
      }
    }
  };

  const handleCardClick = (chapter, index) => {
    if (!isChapterLocked(index)) {
      navigate(`/courses/${courseId}/chapters/${chapter.id}`);
    }
  };

  const handleQuizClick = (e, chapter, index) => {
    e.stopPropagation();
    if (!isChapterLocked(index)) {
      navigate(`/courses/${courseId}/chapters/${chapter.id}/question`);
    }
  };

  return (
    <Box>
      <StudentNavBar />

      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Typography variant="h1" sx={{ mb: 4 }}>
          Python 101 Chapters
        </Typography>

        {loading ? (
          <Box 
            sx={{
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', py: 8 
              }}
          >
            <CircularProgress size={60} />
            <Typography variant="h5" sx={{ mt: 3, color: theme.palette.text.primary }}>
              Loading chapters...
            </Typography>
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
            {chapters.map((chapter, index) => {
              const isLocked = isChapterLocked(index);
              const isComplete = completedChapters.has(chapter.id);
              
              return (
                <Card
                  key={chapter.id}
                  onClick={() => handleCardClick(chapter, index)}
                  sx={{
                    p: 2,
                    borderRadius: '20px',
                    backgroundColor: isLocked ? theme.palette.secondary.blocked : theme.palette.secondary.main,
                    transition: '0.3s',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.6 : 1,
                    border: isComplete ? `2px solid ${theme.palette.primary.main}` : 'none',
                    '&:hover': {
                      backgroundColor: isLocked ? theme.palette.secondary.blocked : theme.palette.secondary.pale,
                      transform: isLocked ? 'none' : 'translateY(-4px)',
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
                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                        {isLocked ? (
                          <LockIcon sx={{ color: theme.palette.text.secondary, fontSize: '2rem' }} />
                        ) : isComplete ? (
                          <CheckCircleIcon sx={{ color: theme.palette.primary.main, fontSize: '2rem' }} />
                        ) : null}
                        
                        <Box>
                          <Typography variant="h3" sx={{ color: theme.palette.text.secondary }}>
                            {chapter.title || chapter.name}
                          </Typography>
                          
                          {isLocked ? (
                            <Chip 
                              label="Complete previous chapter to unlock" 
                              size="small"
                              sx={{ 
                                mt: 1, 
                                backgroundColor: theme.palette.secondary.restricted,
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          ) : isComplete ? (
                            <Chip 
                              icon={<CheckCircleIcon sx={{ color: 'white !important' }} />}
                              label="Chapter Complete" 
                              size="small"
                              sx={{ 
                                mt: 1,
                                backgroundColor: theme.palette.primary.main,
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          ) : (
                            <Chip 
                              label="In Progress" 
                              size="small"
                              sx={{ 
                                mt: 1, 
                                backgroundColor: '#ff9800',
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                      
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={isLocked ? <LockIcon /> : <PlayArrowIcon />}
                          onClick={(e) => handleQuizClick(e, chapter, index)}
                          disabled={isLocked}
                          sx={{ 
                            height: '50px',
                            fontSize: '1.1rem',
                            minWidth: '150px',
                          }}
                        >
                          {isLocked ? 'Locked' : isComplete ? 'Review' : 'Start Quiz'}
                        </Button>

                        <Button
                          variant="outlined"
                          startIcon={<RestartAltIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            resetProgress(courseId, chapter.id);
                          }}
                          disabled={isLocked}
                        >
                          Reset
                        </Button>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
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

export default Lesson;