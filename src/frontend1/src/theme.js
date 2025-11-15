import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#b3ff84',
      contrastText: '#1a1a1a',
    },
    secondary: {
      main: '#c7ff9f', //Brighter accent green
      contrastText: '#1a1a1a',
    },
    background: {
      default: '#2D2D2D',
      paper: '#E8F5D0', //Light green card background
    },
    text: {
      primary: '#D4AF37',
      secondary: '#434343', //Dark text for content on light backgrounds
    },
    menu: {
      main: '#b3ff84',
      text: '#2D2D2D',
    },
    success: {
      main: '#5C9F1E',
    },
    info: {
      main: '#D4AF37', //Gold accent colour
    },
  },
  typography: {
    fontFamily: 'Comfortaa, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    allVariants: {
      color: '#434343',
    },
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      color: '#D4AF37',
      letterSpacing: '0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#434343',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#434343',
    },
    body1: {
      fontSize: '1rem',
      color: '#434343',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#434343',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          backgroundColor: '#2D2D2D',
          color: '#434343',
          fontFamily: 'Comfortaa, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          backgroundImage: 'linear-gradient(135deg, #2D2D2D 0%, #1a1a1a 100%)',
          minHeight: '100vh',
        },
        code: {
          fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontFamily: 'Comfortaa, sans-serif',
          fontSize: '1rem',
          padding: '10px 24px',
          fontWeight: 500,
          transition: 'all 0.3s ease',
        },
        contained: {
          boxShadow: '0 4px 6px #0000001a',
          '&:hover': {
            boxShadow: '0 6px 12px #00000026',
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          backgroundColor: '#b3ff84ec',
          color: '#1a1a1a',
          '&:hover': {
            backgroundColor: '#c7ff9fea',
          },
        },
        containedSecondary: {
          backgroundColor: '#c7ff9f',
          color: '#1a1a1a',
          '&:hover': {
            backgroundColor: '#d4ffb3',
          },
        },
        outlined: {
          borderColor: '#D4AF37',
          color: '#D4AF37',
          borderWidth: '2px',
          '&:hover': {
            borderColor: '#c49d2e',
            backgroundColor: '#d4af3714',
            borderWidth: '2px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#E8F5D0',
          borderRadius: '20px',
          boxShadow: '0 8px 32px #0000004d',
        },
        elevation1: {
          boxShadow: '0 4px 16px #00000033',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          //Default styling for TextFields with white background
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            borderRadius: '6px',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: '#c4c4c4',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: '#77d93880',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#b3ff84ec',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#434343',
            fontWeight: 500,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#b3ff84',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#b3ff84',
          color: '#2d2d2dff',
          boxShadow: '0 2px 8px #00000026',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#434343',
          textDecoration: 'none',
          fontWeight: 500,
          transition: 'color 0.2s ease',
          '&:hover': {
            color: '#b3ff84',
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 8px 32px #0000004d',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#d4af3733',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.MuiInputBase-root': {
            color: '#FFFFFF',
          },
        },
      },
    },
  },
});