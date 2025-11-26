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
  const [userName, setUserName] = useState("John"); //??? Fetch from API or auth context
  const [recommendedLesson, setRecommendedLesson] = useState({
    name: "Start your first lesson!",
    subtitle: "",
    mastery: 0,
    courseId: null,
    chapterId: null,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetched = await api.get("/courses");
        setCourses(fetched);
      } catch (e) {
        console.error("Failed to fetch courses", e);
      }
    };

    const fetchProgress = async () => {
      try {
        const data = await api.get("/student/progress");
        let recCourse = null;
        let recChapter = null;
        let min = 101;

        for (const [courseId, chapters] of Object.entries(data)) {
          for (const [chapterId, info] of Object.entries(chapters)) {
            if (info.percentage < min && info.percentage < 100) {
              min = info.percentage;
              recCourse = courseId;
              recChapter = chapterId;
            }
          }
        }

        if (recCourse && recChapter) {
          const chapter = data[recCourse][recChapter];

          console.log("Student has progress - showing chapter:", chapter.title);

          setRecommendedLesson({
            name: chapter.title.replace(/^Chapter \d+:\s*/, ""),
            subtitle: "",
            mastery: Math.round(chapter.percentage),
            courseId: recCourse,
            chapterId: recChapter,
          });
        } else {
          const firstCourse = Object.keys(data)[0];
          const firstChapter = Object.keys(data[firstCourse])[0];
          const chapter = data[firstCourse][firstChapter];

          console.log("Student hasn't started - Full chapter data:", chapter);
          console.log("Chapter title:", chapter.title);

          const cleanedTitle = chapter.title.replace(/^Chapter \d+:\s*/, "");
          console.log("Cleaned subtitle:", cleanedTitle);

          setRecommendedLesson({
            name: "Start your first lesson!",
            subtitle: chapter.title.replace(/^Chapter \d+:\s*/, ""),
            mastery: Math.round(chapter.percentage),
            courseId: firstCourse,
            chapterId: firstChapter,
          });
        }
      } catch (e) {
        console.error("Failed to fetch progress", e);
      }
    };

    fetchCourses();
    fetchProgress();
  }, []);

  return (
    <Box sx={{ mb: 5, }}>
      {/* AppBar */}
      <StudentNavBar />
      
      <Container 
        maxWidth="lg" 
        sx={{ pt: 4 }}
      >
        <Typography 
          variant="h1" 
          sx={{ 
            mb: 4, 
            ml: { xs: 1, sm: 2, md: 3 },
          }}
        >
          Welcome, {userName}!
        </Typography>

        {/* Recommanded Lesson Card */}
        <Typography 
          variant="h3" 
          sx={{ 
            mb: 1.2, 
            ml: { xs: 3, sm: 4  , md: 6 },
          }}
        >
          Recommended Lesson:
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center", 
          }}
        >
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
            }}
          >
            <CardContent>
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
                    // height: "100%", 
                    alignSelf: "stretch",
                  }} 
                />

                {/* Mastery visual */}
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

                  <Box 
                    sx={{ 
                      position: "relative", 
                      display: "inline-flex" 
                    }}
                  >
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
              fullWidth onClick={() => goTo("/courses/python101")}
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
                fullWidth onClick={() => goTo("/docs")}
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
                fullWidth onClick={() => goTo("/progress")}
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
                fullWidth onClick={() => goTo("/chat")}
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