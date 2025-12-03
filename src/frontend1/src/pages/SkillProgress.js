import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Stack,
  Divider,
  Chip,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import CodeIcon from '@mui/icons-material/Code';
import QuizIcon from '@mui/icons-material/Quiz';
import { useTheme } from '@mui/material/styles';
import api from '../services/api';
import logo from '../images/pypiper_logo_transparent.png';

function SkillProgress() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch chapters from python101 course
        const chaps = await api.get('/courses/python101/chapters');
        console.log('Chapters fetched:', chaps);
        setChapters(chaps);

        // Fetch progress for each chapter
        const progressMap = {};
        for (const ch of chaps) {
          try {
            const prog = await api.get(`/courses/python101/chapters/${ch.id}/progress`);
            console.log(`Progress for chapter ${ch.id}:`, prog);
            progressMap[ch.id] = prog;
          } catch (e) {
            console.error("Error fetching progress for", ch.id, e);
          }
        }
        setProgressData(progressMap);

      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const goTo = (path) => navigate(path);
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const getMasteryLevel = (mastery) => {
    if (mastery >= 0.8) return { label: 'Mastered', color: 'success', icon: '🏆' };
    if (mastery >= 0.5) return { label: 'Proficient', color: 'warning', icon: '⭐' };
    if (mastery > 0) return { label: 'Learning', color: 'info', icon: '📚' };
    return { label: 'Not Started', color: 'default', icon: '🌱' };
  };

  const calculateStats = () => {
    const allMasteries = [];
    let totalMcq = 0;
    let totalCode = 0;
    let count = 0;
    let masteredChapters = 0;

    Object.values(progressData).forEach(prog => {
      if (prog?.breakdown) {
        const mcq = prog.breakdown.mcq?.mastery || 0;
        const code = prog.breakdown.code?.mastery || 0;
        totalMcq += mcq;
        totalCode += code;
        count++;
        allMasteries.push(mcq, code);

        if (prog.is_complete) {
          masteredChapters++;
        }
      }
    });

    const avgMastery = count > 0 ? ((totalMcq + totalCode) / (count * 2)) : 0;
    const totalSkills = count * 2;

    return {
      totalSkills,
      masteredChapters,
      avgMastery: Math.round(avgMastery * 100),
      avgMcq: count > 0 ? Math.round((totalMcq / count) * 100) : 0,
      avgCode: count > 0 ? Math.round((totalCode / count) * 100) : 0,
    };
  };

  const stats = calculateStats();

  const drawerContent = (
    <Box sx={{ width: 260 }}>
      <Box sx={{ p: 2, backgroundColor: theme.palette.accent.main }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          PyPiper Menu
        </Typography>
      </Box>
      <List>
        <ListItem disablePadding><ListItemButton onClick={() => goTo('/menu')}><ListItemText primary="Home" /></ListItemButton></ListItem>
        <ListItem disablePadding><ListItemButton onClick={() => goTo('/courses/python101')}><ListItemText primary="Python 101 Lessons" /></ListItemButton></ListItem>
        <ListItem disablePadding><ListItemButton onClick={() => goTo('/progress')} selected><ListItemText primary="Skill Progress" /></ListItemButton></ListItem>
        <ListItem disablePadding><ListItemButton onClick={() => goTo('/docs')}><ListItemText primary="Docs" /></ListItemButton></ListItem>
        <ListItem disablePadding><ListItemButton onClick={() => goTo('/chat')}><ListItemText primary="Chat with PyP" /></ListItemButton></ListItem>
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding><ListItemButton onClick={() => goTo('/login')}><ListItemText primary="Logout" /></ListItemButton></ListItem>
      </List>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#121212' }}>
        <CircularProgress />
      </Box>
    );
  }

  const hasProgress = Object.keys(progressData).length > 0 && stats.totalSkills > 0;

  return (
    <Box sx={{ bgcolor: '#121212', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton edge="start" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src={logo} alt="PyPiper Logo" style={{ height: '40px', width: 'auto' }} />
            <Typography variant="h3" sx={{ fontWeight: 600 }}>PyPiper</Typography>
          </Box>
          <Box sx={{ width: 40 }} />
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>

      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Typography variant="h1" sx={{ mb: 2, color: '#FAD48D' }}>
          Your Skill Mastery
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, color: '#b0b0b0' }}>
          Track your progress across Python skills using Linear Regression Knowledge Tracing
        </Typography>

        {!hasProgress ? (
          <Card
            elevation={4}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: '16px',
              bgcolor: '#1e1e1e',
              border: '1px solid #333'
            }}
          >
            <SchoolIcon sx={{ fontSize: 80, color: '#666', mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#FAD48D', mb: 2, fontWeight: 600 }}>
              No progress yet!
            </Typography>
            <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
              Start taking quizzes and coding challenges to track your mastery.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/courses/python101')}
              sx={{ fontWeight: 600 }}
            >
              Start Learning
            </Button>
          </Card>
        ) : (
          <>
            {/* Stats Overview */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 2,
                    bgcolor: '#1e1e1e',
                    border: '1px solid #333',
                    borderRadius: 2,
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    '&:hover': { borderColor: '#FAD48D', transform: 'translateY(-2px)' }
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 40, color: '#FAD48D', mb: 1 }} />
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                    {chapters.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Chapters
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 2,
                    bgcolor: '#1e1e1e',
                    border: '1px solid #333',
                    borderRadius: 2,
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    '&:hover': { borderColor: '#4caf50', transform: 'translateY(-2px)' }
                  }}
                >
                  <EmojiEventsIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                    {stats.masteredChapters}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Mastered
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 2,
                    bgcolor: '#1e1e1e',
                    border: '1px solid #333',
                    borderRadius: 2,
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    '&:hover': { borderColor: '#2196f3', transform: 'translateY(-2px)' }
                  }}
                >
                  <QuizIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                    {stats.avgMcq}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Quiz Avg
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 2,
                    bgcolor: '#1e1e1e',
                    border: '1px solid #333',
                    borderRadius: 2,
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    '&:hover': { borderColor: '#f50057', transform: 'translateY(-2px)' }
                  }}
                >
                  <CodeIcon sx={{ fontSize: 40, color: '#f50057', mb: 1 }} />
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                    {stats.avgCode}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Code Avg
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Stack spacing={2}>
              {chapters.map(chapter => {
                const prog = progressData[chapter.id] || {
                  breakdown: { mcq: { mastery: 0 }, code: { mastery: 0 } },
                  is_complete: false
                };

                const mcqVal = Math.round((prog.breakdown?.mcq?.mastery || 0) * 100);
                const codeVal = Math.round((prog.breakdown?.code?.mastery || 0) * 100);
                const avgVal = Math.round((mcqVal + codeVal) / 2);
                const level = getMasteryLevel(avgVal / 100);

                return (
                  <Card
                    key={chapter.id}
                    elevation={4}
                    sx={{
                      borderRadius: '16px',
                      bgcolor: '#1e1e1e',
                      border: '1px solid #333',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                        borderColor: '#FAD48D'
                      }
                    }}
                    onClick={() => navigate(`/courses/python101/chapters/${chapter.id}/question`)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h5" sx={{ color: '#FAD48D', fontWeight: 600, mb: 0.5 }}>
                            {level.icon} {chapter.title || chapter.name}
                          </Typography>
                        </Box>
                        <Chip
                          label={level.label}
                          color={level.color}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      {/* Progress Bars */}
                      <Stack spacing={1.5}>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#e0e0e0', fontWeight: 600 }}>
                              <QuizIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                              Quiz Mastery
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700 }}>
                              {mcqVal}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={mcqVal}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              bgcolor: '#0a0a0a',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: mcqVal >= 80 ? '#4caf50' :
                                  mcqVal >= 50 ? '#FAD48D' :
                                    '#2196f3',
                                borderRadius: 5,
                              }
                            }}
                          />
                        </Box>

                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#e0e0e0', fontWeight: 600 }}>
                              <CodeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                              Coding Mastery
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700 }}>
                              {codeVal}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={codeVal}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              bgcolor: '#0a0a0a',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: codeVal >= 80 ? '#4caf50' :
                                  codeVal >= 50 ? '#FAD48D' :
                                    '#f50057',
                                borderRadius: 5,
                              }
                            }}
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </>
        )}

        <Paper
          elevation={4}
          sx={{
            mt: 4,
            p: 3,
            bgcolor: '#1e1e1e',
            borderRadius: '16px',
            border: '1px solid #333'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: '#FAD48D', fontWeight: 600 }}>
            Understanding Mastery Levels
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#2a2a2a', borderRadius: 2 }}>
                <Chip label="Not Started" color="default" size="small" sx={{ minWidth: '110px' }} />
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Little to no attempts
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#2a2a2a', borderRadius: 2 }}>
                <Chip label="Learning" color="info" size="small" sx={{ minWidth: '110px' }} />
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  1-49% - Starting to learn
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#2a2a2a', borderRadius: 2 }}>
                <Chip label="Proficient" color="warning" size="small" sx={{ minWidth: '110px' }} />
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  50-79% - Reinforcing fundamentals, harder questions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#2a2a2a', borderRadius: 2 }}>
                <Chip label="Mastered" color="success" size="small" sx={{ minWidth: '110px' }} />
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  80%+ - Excellet, handling complex questions!
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Typography variant="caption" sx={{ color: '#777', mt: 2, display: 'block', fontStyle: 'italic' }}>
            * Mastery is calculated using Bayesian Knowledge Tracing (BKT) which adapts to your learning patterns
          </Typography>
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/menu')}
            sx={{
              borderColor: '#FAD48D',
              color: '#FAD48D',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#fff',
                bgcolor: 'rgba(250, 212, 141, 0.1)'
              }
            }}
          >
            Back to Menu
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default SkillProgress;