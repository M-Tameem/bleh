import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  Box, Container, Typography, Paper, Button, CircularProgress,
  Divider, Stack, Card, CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import { useTheme } from '@mui/material/styles';
import api from '../services/api';
import StudentNavBar from '../components/StudentNavBar';

function LessonView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { courseId, chapterId } = useParams();

  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChapter() {
      setLoading(true);
      try {
        const chapters = await api.get(`/courses/${courseId}/chapters`);
        const currentChapter = chapters.find(ch => ch.id === chapterId);
        if (currentChapter) setChapter(currentChapter);
        else navigate(`/courses/${courseId}`);
      } catch (error) {
        navigate(`/courses/${courseId}`);
      } finally {
        setLoading(false);
      }
    }
    fetchChapter();
  }, [courseId, chapterId, navigate]);

  // Markdown custom renderers to ensure dark mode readability
  const markdownComponents = {
    p: ({ node, ...props }) => <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#e0e0e0', mb: 2 }} {...props} />,
    h1: ({ node, ...props }) => <Typography variant="h4" sx={{ color: '#fff', mt: 3, mb: 2 }} {...props} />,
    h2: ({ node, ...props }) => <Typography variant="h5" sx={{ color: theme.palette.accent.light, mt: 3, mb: 2 }} {...props} />,
    h3: ({ node, ...props }) => <Typography variant="h6" sx={{ color: theme.palette.accent.light, mt: 2, mb: 1 }} {...props} />,
    li: ({ node, ...props }) => (
      <li style={{ color: '#e0e0e0', lineHeight: '1.8', marginBottom: '8px' }}>{props.children}</li>
    ),
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '')
      return !inline ? (
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#0a0a0a',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 2,
            my: 2,
            overflowX: 'auto'
          }}
        >
          <code style={{ fontFamily: '"Fira Code", monospace', color: theme.palette.accent.pale, whiteSpace: 'pre' }} {...props}>
            {children}
          </code>
        </Paper>
      ) : (
        <code style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', color: '#fff' }} {...props}>
          {children}
        </code>
      )
    }
  };

  if (loading) return <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (!chapter) return null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#121212' }}>
      <StudentNavBar />

      <Container maxWidth="md" sx={{ pt: 6, pb: 8 }}>
        <Box sx={{ mb: 6 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/courses/${courseId}`)} sx={{ mb: 2, color: '#aaa' }}>
            Back to Course
          </Button>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, color: '#fff' }}>
            {chapter.name || chapter.title}
          </Typography>
          {chapter.content && (
            <Typography variant="h6" sx={{ color: '#bbb', fontWeight: 400, lineHeight: 1.6 }}>
              {chapter.content}
            </Typography>
          )}
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 }, borderRadius: 4,
            backgroundColor: '#1e1e1e', mb: 6, border: '1px solid #333'
          }}
        >
          {chapter.lesson?.sections ? (
            <Stack spacing={4}>
              {chapter.lesson.sections.map((section, index) => (
                <Box key={index}>
                  {section.content && (
                    <ReactMarkdown components={markdownComponents}>
                      {section.content}
                    </ReactMarkdown>
                  )}
                  {index < chapter.lesson.sections.length - 1 && <Divider sx={{ mt: 4, borderColor: '#333' }} />}
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography align="center" sx={{ color: '#888' }}>Content loading...</Typography>
          )}
        </Paper>

        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#fff' }}>Next Steps</Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Practice Card */}
          <Card sx={{ flex: 1, bgcolor: '#1e1e1e', borderRadius: 4, border: '1px solid #333', transition: 'all 0.2s', '&:hover': { borderColor: theme.palette.info.main, transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <SchoolIcon color="info" />
                <Typography variant="h6" sx={{ color: '#fff' }}>Practice Quiz</Typography>
              </Stack>
              <Typography variant="body2" sx={{ mb: 3, color: '#aaa' }}>
                Unlimited attempts with AI assistance.
              </Typography>
              <Button variant="outlined" color="info" fullWidth onClick={() => navigate(`/courses/${courseId}/chapters/${chapterId}/question?mode=practice`)}>
                Start Practice
              </Button>
            </CardContent>
          </Card>

          {/* Test Card */}
          <Card sx={{ flex: 1, bgcolor: '#1e1e1e', borderRadius: 4, border: '1px solid #333', transition: 'all 0.2s', '&:hover': { borderColor: theme.palette.warning.main, transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <QuizIcon color="warning" />
                <Typography variant="h6" sx={{ color: '#fff' }}>Chapter Test</Typography>
              </Stack>
              <Typography variant="body2" sx={{ mb: 3, color: '#aaa' }}>
                Prove your mastery. Scores are recorded.
              </Typography>
              <Button variant="contained" color="warning" fullWidth onClick={() => navigate(`/courses/${courseId}/chapters/${chapterId}/question?mode=test`)}>
                Take Test
              </Button>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}

export default LessonView;