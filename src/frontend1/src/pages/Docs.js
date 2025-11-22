import React, { useState } from 'react';
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
  Paper,
  Button,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import logo from '../images/pypiper_logo_transparent.png';

function Docs() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          <ListItemButton onClick={() => goTo("/menu")}>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

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
          <ListItemButton onClick={() => goTo("/docs")} selected>
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

      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Typography variant="h1" sx={{ mb: 4 }}>
          Python Documentation
        </Typography>

        <Paper 
          sx={{ 
            p: 4, 
            borderRadius: "20px",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h3" sx={{ mb: 3, color: theme.palette.text.primary }}>
            A
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography component="code" sx={{ 
              color: theme.palette.accent.pale,
              fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.95rem',
            }}>
              abs(number, /)
            </Typography>
            <Typography sx={{ mt: 1, color: theme.palette.text.muted }}>
              Return the absolute value of a number. The argument may be an integer, 
              a floating-point number, or an object implementing <code>__abs__()</code>. If the 
              argument is a complex number, its magnitude is returned.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography component="code" sx={{ 
              color: theme.palette.accent.pale,
              fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.95rem',
            }}>
              aiter(async_iterable, /)
            </Typography>
            <Typography sx={{ mt: 1, color: theme.palette.text.muted }}>
              Return an asynchronous iterator for an asynchronous iterable. Equivalent 
              to calling <code>x.__aiter__()</code>.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography component="code" sx={{ 
              color: theme.palette.accent.pale,
              fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.95rem',
            }}>
              all(iterable, /)
            </Typography>
            <Typography sx={{ mt: 1, color: theme.palette.text.muted }}>
              Return True if all elements of the iterable are true (or if the iterable is empty). 
              Equivalent to:
            </Typography>
            <Box 
              component="pre" 
              sx={{ 
                mt: 2,
                p: 2, 
                backgroundColor: '#121212',
                borderRadius: 2,
                overflowX: 'auto',
              }}
            >
              <code style={{ 
                color: theme.palette.accent.pale,
                fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
                fontSize: '0.9rem',
              }}>
{`def all(iterable):
    for element in iterable:
        if not element:
            return False
    return True`}
              </code>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography component="code" sx={{ 
              color: theme.palette.accent.pale,
              fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.95rem',
            }}>
              awaitable anext(async_iterator, /)
            </Typography>
            <br />
            <Typography component="code" sx={{ 
              color: theme.palette.accent.pale,
              fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.95rem',
            }}>
              awaitable anext(async_iterator, default, /)
            </Typography>
            <Typography sx={{ mt: 1, color: theme.palette.text.muted }}>
              When awaited, return the next item from the given asynchronous iterator, or 
              default if given and the iterator is exhausted.
            </Typography>
            <Typography sx={{ mt: 1, color: theme.palette.text.muted }}>
              This is the async variant of the <code>next()</code> builtin, and behaves similarly.
            </Typography>
            <Typography sx={{ mt: 1, color: theme.palette.text.muted }}>
              This calls the <code>__anext__()</code> method of async_iterator, returning an awaitable. 
              Awaiting this returns the next value of the iterator. If default is given, it is 
              returned if the iterator is exhausted, otherwise StopAsyncIteration is raised.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography component="code" sx={{ 
              color: theme.palette.accent.pale,
              fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.95rem',
            }}>
              any(iterable, /)
            </Typography>
            <Typography sx={{ mt: 1, color: theme.palette.text.muted }}>
              Return True if any element of the iterable is true. If the iterable is empty, return False. 
              Equivalent to:
            </Typography>
            <Box 
              component="pre" 
              sx={{ 
                mt: 2,
                p: 2, 
                backgroundColor: '#121212',
                borderRadius: 2,
                overflowX: 'auto',
              }}
            >
              <code style={{ 
                color: theme.palette.accent.pale,
                fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
                fontSize: '0.9rem',
              }}>
{`def any(iterable):
    for element in iterable:
        if element:
            return True
    return False`}
              </code>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography component="code" sx={{ 
              color: theme.palette.accent.pale,
              fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.95rem',
            }}>
              ascii(object, /)
            </Typography>
            <Typography sx={{ mt: 1, color: theme.palette.text.muted }}>
              As <code>repr()</code>, return a string containing a printable representation of an object, but escape 
              the non-ASCII characters in the string returned by <code>repr()</code> using \x, \u, or \U escapes. This 
              generates a string similar to that returned by <code>repr()</code> in Python 2.
            </Typography>
          </Box>

          <Typography variant="h3" sx={{ mt: 4, mb: 3, color: theme.palette.text.primary }}>
            B
          </Typography>
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/menu')}
            sx={{
              borderColor: '#39c017ff',
              color: '#39c017ff',
              '&:hover': {
                borderColor: '#76ec58ff',
                backgroundColor: '#39c01714',
              },
            }}
          >
            Back to Menu
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Docs;