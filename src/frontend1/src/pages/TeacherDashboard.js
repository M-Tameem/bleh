import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Box, 
  Typography,
  Container,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Alert,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TeacherNavBar from '../components/TeacherNavBar';
import PeopleIcon from '@mui/icons-material/People';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';

function TeacherDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [classes, setClasses] = useState([]);
  const [classStats, setClassStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacherName, setTeacherName] = useState('Jane');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await api.get('/classes');
      console.log('Classes data received:', data);
      setClasses(data || []);
      
      if (data && Array.isArray(data)) {
        const statsPromises = data.map(cls => 
          api.get(`/class/${cls.id}/statistics`)
        );
        const statsResponses = await Promise.all(statsPromises);
        
        const statsMap = {};
        statsResponses.forEach((stats, index) => {
          statsMap[data[index].id] = stats;
        });
        setClassStats(statsMap);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError(err.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleClassClick = (classId) => {
    navigate(`/classes/${classId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default',
        }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.primary' }}>
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}>
      
      <TeacherNavBar />

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/*Welcome*/}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography 
            variant='h1' 
            sx={{
              mb: 2,
              textShadow: `0 5px 15px ${theme.palette.accent.main}65`,
            }}>
            Teacher Dashboard
          </Typography>
          <Typography variant='h2' sx={{ color: 'text.muted' }}>
            Welcome, {teacherName}!
          </Typography>
        </Box>

        {/*Error*/}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: '20px',
              bgcolor: 'background.paper',
              border: 2,
              borderColor: 'text.risk',
              color: 'text.primary',
            }}>
            {error}
          </Alert>
        )}

        {/*Classes Grid*/}
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {classes.map((cls) => {
            const stats = classStats[cls.id] || {};
            const hasRisk = stats.studentsAtRisk > 0;

            return (
              <Grid   item xs="auto" sx={{ maxWidth: 400, flexGrow: 1 }} key={cls.id}>
                <Card
                  sx={{
                    borderRadius: '20px',
                    border: 2,
                    borderColor: hasRisk ? 'text.risk' : 'secondary.main',
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}>
                  <CardContent sx={{ p: 3 }}>
                    {/*Class Name*/}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SchoolIcon sx={{ color: 'secondary.main', mr: 1, fontSize: 28 }} />
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            color: 'text.header',
                            fontWeight: 700,
                          }}>
                          {cls.name}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.muted',
                          fontSize: '0.95rem',
                        }}>
                        {cls.description}
                      </Typography>
                    </Box>

                    {/*Stats*/}
                    {stats && Object.keys(stats).length > 0 ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/*# of students*/}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            p: 2,
                            bgcolor: 'background.paper',
                            borderRadius: '12px',
                          }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PeopleIcon sx={{ color: 'secondary.main', mr: 1.5, fontSize: 28 }} />
                            <Typography variant="body1" sx={{ color: 'text.muted', fontWeight: 500 }}>
                              Students
                            </Typography>
                          </Box>
                          <Typography variant="h4" sx={{ color: 'text.header', fontWeight: 700 }}>
                            {stats.totalStudents || 0}
                          </Typography>
                        </Box>

                        {/*Avg Grade*/}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            p: 2,
                            bgcolor: 'background.paper',
                            borderRadius: '12px',
                          }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TrendingUpIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
                            <Typography variant="body1" sx={{ color: 'text.muted', fontWeight: 500 }}>
                              Avg Grade
                            </Typography>
                          </Box>
                          <Typography variant="h4" sx={{ color: 'text.header', fontWeight: 700 }}>
                            {stats.averageGrade || 0}%
                          </Typography>
                        </Box>

                        {/*Avg Work Completed*/}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            p: 2,
                            bgcolor: 'background.paper',
                            borderRadius: '12px',
                          }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AssignmentIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
                            <Typography variant="body1" sx={{ color: 'text.muted', fontWeight: 500 }}>
                              Avg Completed
                            </Typography>
                          </Box>
                          <Typography variant="h4" sx={{ color: 'text.header', fontWeight: 700 }}>
                            {stats.averageProgress || 0}%
                          </Typography>
                        </Box>

                        {/*Students at Risk*/}
                        {hasRisk && (
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              p: 2,
                              bgcolor: 'background.paper',
                              borderRadius: '12px',
                              border: 2,
                              borderColor: 'text.risk',
                            }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <WarningIcon sx={{ color: 'text.risk', mr: 1.5, fontSize: 28 }} />
                              <Typography variant="body1" sx={{ color: 'text.muted', fontWeight: 500 }}>
                                At Risk
                              </Typography>
                            </Box>
                            <Typography variant="h4" sx={{ color: 'text.risk', fontWeight: 700 }}>
                              {stats.studentsAtRisk}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 3 }}>
                        <CircularProgress size={32} />
                        <Typography variant="body2" sx={{ color: 'text.muted', mt: 2 }}>
                          Loading stats...
                        </Typography>
                      </Box>
                    )}

                    {/*View Details*/}
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClassClick(cls.id);
                      }}
                      sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: '12px',
                        fontWeight: 600,
                      }}>
                      View Class Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/*Empty*/}
        {!loading && classes.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <SchoolIcon sx={{ fontSize: 80, color: 'text.muted', mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 1, color: 'text.primary' }}>
              No Classes Found
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.muted' }}>
              There are no classes available at the moment.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );  
}

export default TeacherDashboard;