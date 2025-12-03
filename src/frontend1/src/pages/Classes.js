import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Typography,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TeacherNavBar from '../components/TeacherNavBar';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import WarningIcon from '@mui/icons-material/Warning';

function Classes() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { classId } = useParams();
  
  const [classData, setClassData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (classId) {
      fetchClassData();
      fetchStatistics();
    }
  }, [classId]);

  const fetchClassData = async () => {
    try {
      setLoading(true);

      console.log('Fetching class data for:', classId);
      const data = await api.get(`/class/${classId}`);

      console.log('Class data received:', data);
      setClassData(data);

      setError(null);
    } catch (err) {
      console.error('Error fetching class data:', err);
      setError(err.message || 'Failed to load class data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      console.log('Fetching statistics for:', classId);
      const data = await api.get(`/class/${classId}/statistics`);

      console.log('Statistics received:', data);
      setStatistics(data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleStudentClick = (studentId) => {
    navigate(`/class/student/${studentId}`);
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
          Loading class data...
        </Typography>
      </Box>
    );
  }

  if (error) {
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
        
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: '20px',
              bgcolor: 'background.paper',
              border: 2,
              borderColor: 'text.risk',
              color: 'text.primary',
            }}>
            {error}
          </Alert>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/teacher-dashboard')}
            sx={{ 
              mt: 2,
              borderRadius: '12px',
            }}
          >
            Back to Dashboard
          </Button>
        </Container>

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
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h1" 
            sx={{
              mb: 2,
              textShadow: `0 5px 15px ${theme.palette.accent.main}65`,
            }}
          >
            {classData?.name}
          </Typography>

          <Typography variant="h3" sx={{ color: 'text.muted' }}>
            {classData?.description}
          </Typography>
        </Box>

        {/*Stats Cards*/}
        {statistics && (
          <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'left' }}>
            <Grid 
              item xs={12} 
              sm={6} 
              md={3}
            >
              <Card
                sx={{
                  borderRadius: '20px',
                  border: 2,
                  borderColor: 'secondary.main',
                  height: '100%',
                }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PeopleIcon sx={{ color: 'secondary.main', mr: 1 }} />
                    <Typography 
                      variant="body1" 
                      fontWeight={600} 
                      sx={{ color: 'text.header' }}
                    >
                      Total Students
                    </Typography>
                  </Box>
                  
                  <Typography variant="h2" sx={{ color: 'text.header' }}>
                    {statistics.totalStudents}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={3}
            >
              <Card
                sx={{
                  borderRadius: '20px',
                  border: 2,
                  borderColor: 'secondary.main',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1 
                    }}
                  >
                    <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />

                    <Typography 
                      variant="body1" 
                      fontWeight={600} 
                      sx={{ color: 'text.header' }}
                    >
                      Average Grade
                    </Typography>
                  </Box>

                  <Typography 
                    variant="h2" 
                    sx={{ 
                      color: statistics.averageGrade >= 50 ? 'text.header' : 'text.risk' 
                    }}
                  >
                    {statistics.averageGrade}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={3}
            >
              <Card
                sx={{
                  borderRadius: '20px',
                  border: 2,
                  borderColor: 'secondary.main',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1 
                    }}
                  >
                    <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />

                    <Typography 
                      variant="body1" 
                      fontWeight={600} 
                      sx={{ color: 'text.header' }}
                    >
                      Average Progress
                    </Typography>
                  </Box>

                  <Typography variant="h2" sx={{ color: 'text.header' }}>
                    {statistics.averageProgress}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={3}
            >
              <Card
                sx={{
                  borderRadius: '20px',
                  border: 2,
                  borderColor: statistics.studentsAtRisk > 0 ? 'text.risk' : 'secondary.main',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1 
                    }}
                  >
                    <WarningIcon sx={{ color: 'text.risk', mr: 1 }} />
                    <Typography 
                      variant="body1" 
                      fontWeight={600} 
                      sx={{ color: 'text.header' }}
                    >
                      At Risk
                    </Typography>
                  </Box>

                  <Typography variant="h2" sx={{ color: 'text.risk' }}>
                    {statistics.studentsAtRisk}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/*Table of Students*/}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: '20px',
            border: 2,
            borderColor: 'secondary.main',
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: theme.palette.secondary.main + '1a',
                }}>
                <TableCell 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.primary' 
                  }}
                >
                  Last Name
                </TableCell>

                <TableCell 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.primary' 
                  }}
                >
                  First Name
                </TableCell>

                <TableCell 
                  align="center"
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.primary' 
                  }} 
                >
                  Email
                </TableCell>

                <TableCell 
                    align="center"
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.primary' 
                  }} 
                >
                  Grade
                </TableCell>

                <TableCell 
                  align="center"
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.primary' 
                  }} 
                >
                  Work Completed
                </TableCell>

                <TableCell 
                  align="center"
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.primary' 
                  }} 
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {classData?.students?.map((student) => (
                <TableRow
                  key={student.id}
                  onClick={() => handleStudentClick(student.id)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: theme.palette.secondary.main + '0d',
                    },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell sx={{ color: student.grade < 50 ? 'text.risk' : 'text.primary' }}>
                    {student.lastName}
                  </TableCell>
                  
                  <TableCell sx={{ color: student.grade < 50 ? 'text.risk' : 'text.primary' }}>
                    {student.firstName}
                  </TableCell>

                  <TableCell 
                    align="center" 
                    sx={{ 
                      color: student.grade < 50 ? 'text.risk' : 'text.muted',
                      fontSize: '0.875rem',
                    }}
                  >
                    {student.email}
                  </TableCell>

                  <TableCell 
                    align="center" 
                    sx={{ 
                      color: student.grade < 50 ? 'text.risk' : 'text.primary',
                      fontWeight: 600,
                    }}
                  >
                    {student.grade}%
                  </TableCell>

                  <TableCell 
                    align="center" 
                    sx={{ 
                      color: student.grade < 50 ? 'text.risk' : 'text.primary',
                      fontWeight: 600,
                    }}
                  >
                    {student.workCompleted}%
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={student.grade < 50 ? 'At Risk' : 'On Track'}
                      size="small"
                      sx={{
                        bgcolor: student.grade < 50 
                          ? theme.palette.text.risk + '33' 
                          : theme.palette.primary.main + '33',
                        color: student.grade < 50 ? 'text.risk' : 'primary.main',
                        fontWeight: 600,
                        borderRadius: '12px',
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/*Go back*/}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/teacher-dashboard')} 
          >
            Back to Dashboard
          </Button>
        </Box>

      </Container>
    </Box>
  );
}

export default Classes;