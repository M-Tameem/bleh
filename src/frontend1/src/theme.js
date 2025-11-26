import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  //Main colours
  palette: {
    mode: 'dark',
    background: {
      default: '#232323ff', //page bg
      paper: '#251F20',   //cards/panels
    },
    brand: {
      main: '#251F20',
      contrastText: '#FFFFFF',
    },
    accent: {
      main: '#115000ff',
      light: '#F4C97A',
      pale: '#FAD48D',
      outline: '#116f19ff',
      contrastText: '#1a1a1a',
    },
    //Functional colours
    primary: {
      main: '#39c017ff',
      contrastText: '#1a1a1a',
    },
    secondary: {
      main: '#FAD48D',
      pale: '#FBE0A8',
      blocked: '#808080ff',
      restricted: '#ff6b6b',
      contrastText: '#1a1a1a',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#2b2b2bff',
      muted: '#ddddddff',
      risk: '#c80c0cff',
      header: '#ffd64fff',
    },
    divider: '#ffffff12',
  },

  typography: {
    fontFamily: 'Inter, Comfortaa, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontSize: '3rem', fontWeight: 700, color: '#FFFFFF' },
    h2: { fontSize: '2rem', fontWeight: 600, color: '#FFFFFF' },
    h3: { fontSize: '1.5rem', fontWeight: 600, color: '#FFFFFF' },
    h5: { fontWeight: 600 },
    body1: { color: '#2b2b2bff' },
    body2: { color: '#A3A3A3' },
    body3: { fontSize: '1.3rem', display: 'block', },
    body4: { fontSize: '1.1rem', display: 'block', },
    button: { textTransform: 'none', fontWeight: 600 },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          backgroundColor: '#232323ff',
          color: '#FFFFFF',
          minHeight: '100vh',
          backgroundImage: 'linear-gradient(180deg, #00000024, transparent 60%)',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          fontFamily: 'Inter, Comfortaa, sans-serif',
        },
        code: {
          fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
        },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: '#115000ff',
          color: '#FFFFFF',
          borderBottom: '1px solid #ffffff0a',
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 64,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#251F20',
          color: '#FFFFFF',
          borderRight: '1px solid #ffffff0a',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 18px',
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: '#39c017ff',
          color: '#2b2b2bff',
          boxShadow: '0 2px 5px #0d49008c',
          '&:hover': {
            backgroundColor: '#76ec58ff',
            boxShadow: '0 4px 20px #1da0008c',
          },
        },
        outlinedPrimary: {
          borderColor: '#39c017ff',
          color: '#39c017ff',
          backgroundColor: '#39c01714',
          '&:hover': {
            backgroundColor: '#39c01714',
            boxShadow: '0 4px 20px #1da0008c',
           },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffda9621',
          borderColor: '#FAD48D',
          color: '#FFFFFF',
          borderRadius: 16,
          cursor: "pointer",
          transition: "0.3s",
          '&:hover': {
            backgroundColor: '#ffda9621',
            transform: "translateY(-4px)",
            boxShadow: '0 8px 32px #20b000b3',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#251F20',
        },
      },
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#d98b181f',
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },

    MuiListItemText: {
      styleOverrides: {
        primary: { color: '#FFFFFF' },
        secondary: { color: '#A3A3A3' },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff0f',
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#121212',
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#ffffff0f',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(217,139,24,0.34)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#D89418',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#D9D9D9',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#D89418',
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#D9D9D9',
          '&.brand': { color: '#D89418' },
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
        },
      },
    },

    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#D89418',
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          color: '#D89418',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#111',
          color: '#fff',
          borderRadius: 8,
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#D89418',
          color: '#000',
        },
      },
    },

    MuiCircularProgress: {
      defaultProps: {
        variant: 'determinate',
        size: 60,
        thickness: 6,
      },
      styleOverrides: {
        root: {
          color: '#e8c03dff',
          filter: 'drop-shadow(0 0 1px rgba(5, 73, 9, 0.35))'
        }
      } 
    },
  },
});

export default theme;