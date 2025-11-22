import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Grid,
  Stack,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import api from "../services/api";
import logo from '../images/pypiper_logo_transparent.png';

export default function StudentMenu() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [courses, setCourses] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState("John");
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

  const goTo = (path) => navigate(path);
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const drawerContent = (
    <Box sx={{ width: 260 }}>        
      <Box sx={{ p: 2, backgroundColor: theme.palette.accent.main }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          PyPiper Menu
        </Typography>
      </Box>

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => goTo("/courses")}>
            <ListItemText primary="Python 101 Lessons" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => goTo("/progress")}>
            <ListItemText primary="Skill Progress" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => goTo("/docs")}>
            <ListItemText primary="Docs" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => goTo("/chat")}>
            <ListItemText primary="Chat with PyP" />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        <ListItem disablePadding>
          <ListItemButton onClick={() => goTo("/login")}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box>
      {/*AppBar*/}
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton edge="start" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img 
              src={logo} 
              alt="PyPiper Logo" 
              style={{ height: '40px', width: 'auto' }}
            />
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              PyPiper
            </Typography>
          </Box>

          <Box sx={{ width: 40 }} />
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>

      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Typography variant="h1" sx={{ mb: 2 }}>
          Welcome, {userName}!
        </Typography>

        <Typography variant="h3" sx={{ mb: 3 }}>
          Recommended Lesson:
        </Typography>

        <Card
          variant="outlined"
          onClick={() =>
            recommendedLesson.courseId
            ? goTo(`/courses/${recommendedLesson.courseId}/chapter/${recommendedLesson.chapterId}`)
            : goTo("/course/python101")
          }
          sx={{
            p: 2,
            borderRadius: "20px",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography variant="h2" sx={{ color: theme.palette.secondary.main }}>
                  {recommendedLesson.name}
                </Typography>
                {recommendedLesson.subtitle && (
                  <Typography variant="h4" sx={{ color: theme.palette.secondary.main, mt: 1, opacity: 0.8 }}>
                    {recommendedLesson.subtitle}
                  </Typography>
                )}
              </Box>

              <Divider orientation="vertical" flexItem sx={{ borderColor: theme.palette.secondary.main, borderWidth: 1, mr: 1.75 }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" sx={{ mb: 1, color: theme.palette.secondary.main }}>
                  Mastery
                </Typography>
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <CircularProgress variant="determinate" value={recommendedLesson.mastery} size={70} />
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
                    <Typography variant="h5" sx={{ color: theme.palette.secondary.main }}>{recommendedLesson.mastery}%</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/*4-Button Grid*/}
        <Grid container spacing={6} columns={16}
        sx={{
          mt: 4,
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Grid item size={7}>
            <Stack spacing={3}>
              <Button variant="outlined" color="primary" xs={6} sx={{ height: '115px', fontSize: '1.5rem' }} fullWidth onClick={() => goTo("/course/python101")}>
                All Lessons
              </Button>

              <Button variant="outlined" color="primary" xs={6} sx={{ height: '115px', fontSize: '1.5rem' }} fullWidth onClick={() => goTo("/docs")}>
                Docs
              </Button>
            </Stack>
          </Grid>

          <Grid item size={7}>
            <Stack spacing={3}>
              <Button variant="outlined" color="primary" xs={6} sx={{ height: '115px', fontSize: '1.5rem' }}fullWidth onClick={() => goTo("/progress")}>
                Skill Progress
              </Button>

              <Button variant="outlined" color="primary" xs={6} sx={{ height: '115px', fontSize: '1.5rem' }}fullWidth onClick={() => goTo("/chat")}>
                Chat with PyP
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}