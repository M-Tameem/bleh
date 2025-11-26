import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Container, Typography, IconButton,
  Card, CardContent, TextField, Button, Alert, CircularProgress,
  Stack, Paper, Chip, Grid, Dialog, DialogTitle, DialogContent,
  DialogActions, LinearProgress, Avatar, Fade
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CodeIcon from '@mui/icons-material/Code';
import StarsIcon from '@mui/icons-material/Stars';
import HomeIcon from '@mui/icons-material/Home';
import ReplayIcon from '@mui/icons-material/Replay';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import api from '../services/api';
import logo from '../images/pypiper_logo_transparent.png';

function QuizChat({ open, onClose, question, currentAnswer, courseId, chapterId }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const hasFetchedInit = useRef(false);
  const messagesEndRef = useRef(null);
  const theme = useTheme();

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    if (open && !hasFetchedInit.current) {
      setMessages([{ role: 'system', content: "I'm analyzing your code..." }]);
      handleAskHelp();
      hasFetchedInit.current = true;
    }
    if (!open) {
      setMessages([]);
      hasFetchedInit.current = false;
    }
  }, [open, question.id]);

  const handleAskHelp = async () => {
    setIsTyping(true);
    try {
      const res = await api.post('/dialogue/quiz_help', {
        course_id: courseId,
        chapter_id: chapterId,
        question_id: question.question_id || question.id,
        user_answer: currentAnswer,
        question_text: question.question
      });
      setMessages(prev => prev.filter(m => m.role !== 'system'));
      setMessages(prev => [...prev, { role: 'assistant', content: res.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px', bgcolor: '#121212', color: '#fff', border: '1px solid #333', height: '600px' } }}>
      <DialogTitle sx={{ borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: theme.palette.accent.main, width: 32, height: 32 }}><SmartToyIcon fontSize="small" /></Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>PyP Helper</Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#666' }}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#0a0a0a', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.map((msg, i) => {
          const isBot = msg.role === 'assistant' || msg.role === 'system';
          return (
            <Box key={i} sx={{ alignSelf: isBot ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: isBot ? '#1e1e1e' : theme.palette.accent.main, color: isBot ? '#e0e0e0' : '#fff', borderRadius: isBot ? '0px 16px 16px 16px' : '16px 0px 16px 16px', border: isBot ? '1px solid #333' : 'none' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{msg.content}</Typography>
              </Paper>
            </Box>
          );
        })}
        {isTyping && <Box sx={{ alignSelf: 'flex-start' }}><CircularProgress size={16} sx={{ color: '#666' }} /></Box>}
        <div ref={messagesEndRef} />
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: '#121212', borderTop: '1px solid #222' }}>
        <Button fullWidth variant="outlined" onClick={handleAskHelp} disabled={isTyping} startIcon={<SendIcon />} sx={{ borderRadius: '10px', py: 1.5, color: theme.palette.accent.light, borderColor: theme.palette.accent.light }}>Explain Further</Button>
      </DialogActions>
    </Dialog>
  );
}

function Quiz() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const { courseId, chapterId } = useParams();
  const mode = searchParams.get('mode') || 'test';

  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  async function fetchQuestion() {
    setLoading(true);
    setAnswer('');
    setFeedback('');
    try {
      const data = await api.get(`/courses/${courseId}/chapters/${chapterId}/question?mode=${mode}`);
      if (data.is_complete) setShowSummary(true);
      else {
        setQuestion(data);
        if (data.type === 'code' && data.starter_code) setAnswer(data.starter_code);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }

  useEffect(() => { fetchQuestion(); }, [courseId, chapterId, mode]);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const newText = answer.substring(0, selectionStart) + "    " + answer.substring(selectionEnd);
      setAnswer(newText);
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = selectionStart + 4; }, 0);
    }
  };

  async function checkAnswer() {
    if (!answer) return;
    setSubmitting(true);
    try {
      const response = await api.post(`/courses/${courseId}/chapters/${chapterId}/question`, { answer, question_id: question.question_id || question.id, mode });
      setFeedback(response.feedback || "");
      if (response.mastery_update) setQuestion(prev => ({ ...prev, current_mastery: response.mastery_update.new_mastery }));
      if (response.is_correct) setTimeout(fetchQuestion, 1500);
    } catch (error) { setFeedback("Something went wrong."); } finally { setSubmitting(false); }
  }

  const handleResetPractice = async () => {
    try {
      await api.post(`/courses/${courseId}/chapters/${chapterId}/reset_progress`);
      await api.post(`/dialogue/clear_attempts`);
      window.location.reload();
    } catch (e) { alert("Reset failed"); }
  };

  const handleSkip = async () => {
    if (!question) return;
    setLoading(true);
    try {
      await api.post(`/courses/${courseId}/chapters/${chapterId}/skip`, { question_id: question.question_id || question.id, mode });
      await fetchQuestion();
    } catch (error) { await fetchQuestion(); }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#121212' }}><CircularProgress /></Box>;

  if (showSummary) {
    return (
      <Container maxWidth="sm" sx={{ pt: 10 }}>
        <Card sx={{ p: 4, borderRadius: '20px', backgroundColor: '#1e1e1e', color: '#fff', textAlign: 'center', border: '1px solid #333' }}>
          <StarsIcon sx={{ fontSize: 80, color: '#FFD700', mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>Well Done!</Typography>
          <Typography variant="h6" sx={{ color: '#ccc', mb: 4 }}>{mode === 'test' ? "Chapter Mastered" : "Practice Complete"}</Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" startIcon={<HomeIcon />} onClick={() => navigate(`/courses/${courseId}`)}>Back</Button>
            <Button variant="contained" startIcon={<ReplayIcon />} onClick={handleResetPractice} sx={{ bgcolor: '#FFD700', color: '#000' }}>Reset</Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#000' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #333' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton edge="start" onClick={() => navigate(`/courses/${courseId}/chapters/${chapterId}`)}><ArrowBackIcon sx={{ color: '#fff' }} /></IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>{mode === 'practice' ? 'Practice Mode' : 'Chapter Test'}</Typography>
          <Box sx={{ width: 40 }} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
        <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: '24px', backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
          <CardContent>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={mode === 'practice' ? "Practice" : "Test Mode"}
                    color={mode === 'practice' ? "info" : "warning"}
                    size="small"
                  />
                  <Chip
                    label={question?.type === 'code' ? "Coding" : "Quiz"}
                    variant="outlined"
                    sx={{ color: '#fff', borderColor: '#fff' }}
                    size="small"
                  />
                </Box>
                {mode === 'test' && (
                  <Box sx={{ width: '40%' }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" color="warning.main">Mastery</Typography>
                      <Typography variant="caption" color="white">{Math.round((question?.current_mastery || 0) * 100)}%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={(question?.current_mastery || 0) * 100} color="warning" sx={{ height: 6, borderRadius: 3, bgcolor: '#333' }} />
                  </Box>
                )}
              </Stack>

              <Typography variant="h6" sx={{ fontWeight: 500, color: '#ffffff', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '1.1rem' }}>
                {question?.question}
              </Typography>

              {question?.type === 'multiple_choice' ? (
                <Stack spacing={2}>
                  {question.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={answer === option ? "contained" : "outlined"}
                      onClick={() => setAnswer(option)}
                      sx={{
                        justifyContent: 'flex-start', textAlign: 'left', py: 1.5, px: 3, fontSize: '0.95rem', borderRadius: '12px',
                        color: answer === option ? '#000' : '#e0e0e0',
                        borderColor: '#444',
                        backgroundColor: answer === option ? theme.palette.accent.main : 'transparent',
                        '&:hover': { borderColor: theme.palette.accent.light, backgroundColor: answer === option ? theme.palette.accent.main : 'rgba(255,255,255,0.05)' }
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </Stack>
              ) : (
                <Paper elevation={0} sx={{ border: '1px solid #444', borderRadius: 2, overflow: 'hidden' }}>
                  <Box sx={{ bgcolor: '#2d2d2d', px: 2, py: 1, borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <CodeIcon fontSize="small" sx={{ color: '#aaa' }} />
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#ccc' }}>main.py</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#666' }}>Tab enabled</Typography>
                  </Box>
                  <TextField
                    fullWidth multiline minRows={8} value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyDown={handleKeyDown} variant="standard"
                    InputProps={{ disableUnderline: true, sx: { p: 2, fontFamily: '"Fira Code", monospace', backgroundColor: '#0a0a0a', color: '#e0e0e0', lineHeight: 1.6, fontSize: '0.95rem' } }}
                  />
                </Paper>
              )}

              {feedback && <Fade in={true}><Alert severity={(feedback.includes('Correct')) ? 'success' : 'warning'} variant="filled" sx={{ borderRadius: 2 }}>{feedback}</Alert></Fade>}

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={mode === 'practice' ? 6 : 8}>
                  <Button variant="contained" size="large" fullWidth onClick={checkAnswer} disabled={!answer || submitting} sx={{ height: '50px', fontSize: '1rem', fontWeight: 600, bgcolor: theme.palette.accent.main }}>{submitting ? 'Checking...' : 'Submit Answer'}</Button>
                </Grid>
                {mode === 'practice' && (
                  <Grid item xs={12} md={3}>
                    <Button fullWidth variant="outlined" startIcon={<SmartToyIcon />} onClick={() => setChatOpen(true)} sx={{ height: '50px', borderColor: '#555', color: '#ccc' }}>Ask AI</Button>
                  </Grid>
                )}
                <Grid item xs={12} md={mode === 'practice' ? 3 : 4}>
                  <Button fullWidth variant="text" color="error" onClick={handleSkip} sx={{ height: '50px', opacity: 0.7 }}>Skip</Button>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      </Container>
      {question && mode === 'practice' && <QuizChat open={chatOpen} onClose={() => setChatOpen(false)} question={question} currentAnswer={answer} courseId={courseId} chapterId={chapterId} />}
    </Box>
  );
}

export default Quiz;