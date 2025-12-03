import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
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

import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';

function Student() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { studentId } = useParams();

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (studentId) {
        fetchStudent();
    }
  }, [studentId]);

  const fetchStudent = async () => {
    try {
      setLoading(true);

      console.log("Fetching student:", studentId);
      const data = await api.get(`/class/student/${studentId}`);
      
      console.log("Student data received:", data);
      setStudentData(data);

      setError(null);
    } catch (err) {
      console.error("Error fetching student:", err);
      setError(err.message || "Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>

        <CircularProgress size={60} />

        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading student data...
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

  // Variables to make it easy to display values
  const className = studentData?.className;
  const classId = studentData?.classId;
  const student = studentData?.student;
  const firstName = student.firstName;
  const lastName = student.lastName;
  const id = student.id;
  const email = student.email;
  const grade = student.grade;
  const progress = student.workCompleted;
  const worksList = student.workAssigned;

  return (
    <Box sx={{ minHeight: '100vh' }}>

      <TeacherNavBar />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* student info */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h1"
            sx={{ 
                mb:1,
                textShadow: `0 5px 15px ${theme.palette.accent.main}65`, 
            }}
          >
            {firstName} {lastName}
          </Typography>

          <Typography variant="h3" sx={{ color: 'text.muted', mb: 2 }}>
            {id} <br /> {email}
          </Typography>

          {/* class name */}
          <Chip
            icon={<SchoolIcon />}
            label={`${className}`}
            sx={{
              mt: 2,
              fontSize: '1rem',
              bgcolor: theme.palette.secondary.main + '22',
              color: 'text.primary',
              px: 2,
            }}
          />
        </Box>

        {/* statistics cards */}
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            mb: 4, 
            justifyContent: 'left' 
          }}
        >
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4}
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography fontWeight={600}>Average Grade</Typography>
                </Box>

                <Typography 
                  variant="h2"
                  sx={{ color: grade >= 50 ? 'text.header' : 'text.risk' }}
                >
                  {grade}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: '20px', border: 2, borderColor: 'secondary.main' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography fontWeight={600}>Work Completion</Typography>
                </Box>

                <Typography variant="h2" sx={{ color: 'text.header' }}>
                  {progress}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              borderRadius: '20px',
              border: 2,
              borderColor: grade < 50 ? 'text.risk' : 'secondary.main'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WarningIcon sx={{ color: 'text.risk', mr: 1 }} />
                  <Typography fontWeight={600}>Status</Typography>
                </Box>

                <Chip
                  label={grade < 50 ? "At Risk" : "On Track"}
                  sx={{
                    bgcolor: grade < 50
                      ? theme.palette.text.risk + "33"
                      : theme.palette.primary.main + "33",
                    color: grade < 50 ? "text.risk" : "primary.main",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    px: 2,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        
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
                  Course Name
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
              {worksList?.map((work, id) => (
                <TableRow
                  key={id}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: theme.palette.secondary.main + '0d',
                    },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell 
                    sx={{ 
                      color: work.grade < 50 ? 'text.risk' : 'text.muted',
                      fontSize: '0.875rem',
                    }}
                  >
                    {work.course}
                  </TableCell>

                  <TableCell 
                    align="center" 
                    sx={{ 
                      color: work.grade < 50 ? 'text.risk' : 'text.primary',
                      fontWeight: 600,
                    }}
                  >
                    {work.grade}%
                  </TableCell>

                  <TableCell 
                    align="center" 
                    sx={{ 
                      color: work.complete < 40 ? 'text.risk' : 'text.primary',
                      fontWeight: 600,
                    }}
                  >
                    {work.complete}%
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={work.grade < 50 ? 'At Risk' : 'On Track'}
                      size="small"
                      sx={{
                        bgcolor: work.grade < 50 
                          ? theme.palette.text.risk + '33' 
                          : theme.palette.primary.main + '33',
                        color: work.grade < 50 ? 'text.risk' : 'primary.main',
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

        {/* back button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/classes/${classId}`)}
          >
            Back to {classId}
          </Button>
        </Box>

      </Container>
    </Box>
  );
}

export default Student;
