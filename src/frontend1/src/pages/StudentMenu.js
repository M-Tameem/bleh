import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import api from "../services/api";
import StudentNavBar from '../components/StudentNavBar'

export default function StudentMenu() {
  const navigate = useNavigate();
  const theme = useTheme();
  const goTo = (path) => navigate(path);

  const [courses, setCourses] = useState([]);
  const [userName, setUserName] = useState("John");
  const [recommendedLesson, setRecommendedLesson] = useState({
    name: "Start your first lesson!",
    subtitle: "",
    mastery: 0,
    courseId: null,
    chapterId: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetched = await api.get("/courses");
        setCourses(fetched);
        return fetched;
      } catch (e) {
        console.error("Failed to fetch courses", e);
        return [];
      }
    };

    const getChapterProgress = async (courseId, chapterId) => {
      try {
        const response = await api.get(`/courses/${courseId}/chapters/${chapterId}/progress`);
        return {
          chapterId,
          courseId,
          title: chapterId,
          mastery: Math.round(response.overall_mastery * 100),
          isComplete: response.is_complete
        };
      } catch (error) {
        console.error(`Failed to get progress for ${courseId}/${chapterId}:`, error);
        return null;
      }
    };

    const fetchProgress = async (coursesList) => {
      try {
        setLoading(true);
        
        // For each course, get its chapters
        for (const course of coursesList) {
          const courseId = course.id;
          
          try {
            const chapters = await api.get(`/courses/${courseId}/chapters`);
            
            if (!chapters || chapters.length === 0) continue;

            // Check each chapter in order
            let foundIncomplete = false;
            for (let i = 0; i < chapters.length; i++) {
              const chapter = chapters[i];
              const progress = await getChapterProgress(courseId, chapter.id);
              
              if (!progress) continue;

              // Found the first incomplete chapter
              if (!progress.isComplete) {
                setRecommendedLesson({
                  name: chapter.title?.replace(/^Chapter \d+:\s*/, "") || chapter.name,
                  subtitle: "",
                  mastery: progress.mastery,
                  courseId: courseId,
                  chapterId: chapter.id,
                });
                foundIncomplete = true;
                break;
              }
            }

            // If there's an incomplete chapter in this course, stop searching
            if (foundIncomplete) break;

            // If all chapters are complete, recommend the first chapter
            if (!foundIncomplete && chapters.length > 0) {
              const firstChapter = chapters[0];
              const firstProgress = await getChapterProgress(courseId, firstChapter.id);
              
              setRecommendedLesson({
                name: "All chapters complete!",
                subtitle: firstChapter.title?.replace(/^Chapter \d+:\s*/, "") || firstChapter.name,
                mastery: firstProgress?.mastery || 100,
                courseId: courseId,
                chapterId: firstChapter.id,
              });
            }
          } catch (error) {
            console.error(`Error processing course ${courseId}:`, error);
          }
        }
      } catch (e) {
        console.error("Failed to fetch progress", e);
      } finally {
        setLoading(false);
      }
    };

    const initialize = async () => {
      const fetchedCourses = await fetchCourses();
      if (fetchedCourses.length > 0) {
        await fetchProgress(fetchedCourses);
      }
    };

    initialize();
  }, []);

  return (
    <Box sx={{ mb: 5 }}>
      <StudentNavBar />
      
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Typography 
          variant="h1" 
          sx={{ 
            mb: 3.5, 
            ml: { xs: 1, sm: 2, md: 3 },
          }}
        >
          Welcome, {userName}!
        </Typography>

        <Typography 
          variant="h3" 
          sx={{ 
            mb: 2.5, 
            ml: { xs: 3, sm: 4, md: 6 },
          }}
        >
          Recommended Lesson:
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Card
            variant="outlined"
            onClick={() =>
              recommendedLesson.courseId
                ? goTo(`/courses/${recommendedLesson.courseId}/chapters/${recommendedLesson.chapterId}`)
                : goTo("/courses/python101")
            }
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: "20px",
              alignItems: "center", 
              width: "95%",
              cursor: "pointer",
            }}
          >
            <CardContent>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={40} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: theme.palette.secondary.main,
                      fontStyle: 'italic'
                    }}
                  >
                    Loading recommended lesson...
                  </Typography>
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    display: "flex", 
                    justifyContent: "left", 
                    flexWrap: "wrap", 
                    gap: { xs: 1, sm: 2, md: 3 },
                  }}
                >
                  <Box 
                    sx={{ 
                      flex: 1, 
                      display: "flex", 
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        color: theme.palette.secondary.main,
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                      }}
                    >
                      {recommendedLesson.name}
                    </Typography>

                    {recommendedLesson.subtitle && (
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: theme.palette.secondary.main, 
                          mt: 1, 
                          opacity: 0.8, 
                          fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                        }}
                      >
                        {recommendedLesson.subtitle}
                      </Typography>
                    )}
                  </Box>

                  <Divider 
                    orientation="vertical" 
                    flexItem 
                    sx={{ 
                      borderColor: theme.palette.secondary.main, 
                      borderWidth: 1, 
                      mr: 1.75, 
                      alignSelf: "stretch",
                    }} 
                  />

                  <Box sx={{ textAlign: "center" }}>
                    <Typography 
                      variant="h5"
                      sx={{ 
                        mb: 1, 
                        color: theme.palette.secondary.main,
                        fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" }, 
                      }}
                    >
                      Mastery
                    </Typography>

                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <CircularProgress 
                        variant="determinate" 
                        value={recommendedLesson.mastery} 
                        size={{ xs: 50, sm: 60, md: 70 }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            color: theme.palette.secondary.main, 
                            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
                          }}
                        >
                          {recommendedLesson.mastery}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/*4-Button Grid*/}
        <Grid container spacing={6} columns={16}
          sx={{
            mt: 4,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Grid item size={7}>
            <Stack spacing={4}>
              <Button 
                variant="outlined" 
                color="primary" 
                xs={6} 
                sx={{ 
                  height: '115px', 
                  fontSize: { xs: "1.3rem", sm: "1.4rem", md: "1.5rem" },
                }} 
                fullWidth 
                onClick={() => goTo("/courses/python101")}
              >
                All Lessons
              </Button>

              <Button 
                variant="outlined" 
                color="primary" 
                xs={6} 
                sx={{ 
                  height: '115px', 
                  fontSize: { xs: "1.3rem", sm: "1.4rem", md: "1.5rem" },
                }} 
                fullWidth 
                onClick={() => goTo("/docs")}
              >
                Docs
              </Button>
            </Stack>
          </Grid>

          <Grid item size={7}>
            <Stack spacing={4}>
              <Button 
                variant="outlined" 
                color="primary" 
                xs={6} 
                sx={{ 
                  height: '115px', 
                  fontSize: { xs: "1.3rem", sm: "1.4rem", md: "1.5rem" },
                }}
                fullWidth 
                onClick={() => goTo("/progress")}
              >
                Skill Progress
              </Button>

              <Button 
                variant="outlined" 
                color="primary" 
                xs={6} 
                sx={{ 
                  height: '115px', 
                  fontSize: { xs: "1.3rem", sm: "1.4rem", md: "1.5rem" },
                }}
                fullWidth 
                onClick={() => goTo("/chat")}
              >
                Chat with PyP
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}