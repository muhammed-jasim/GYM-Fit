import { createTheme } from '@mui/material/styles';

export const PRIMARY_COLOR = '#288474';
export const PRIMARY_LIGHT = '#3ba492';
export const PRIMARY_DARK = '#1c6155';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: PRIMARY_COLOR,
      light: PRIMARY_LIGHT,
      dark: PRIMARY_DARK,
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f59e0b', // Trophy / PR gold
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f97316',
    },
    info: {
      main: '#0ea5e9',
    },
    ...(mode === 'dark'
      ? {
          background: {
            default: '#0c1116',
            paper: '#131b23',
            subtle: '#18232e',
            elevated: '#1f2d3a',
          },
          text: {
            primary: '#f1f5f9',
            secondary: '#94a3b8',
            disabled: '#64748b',
          },
          divider: 'rgba(255, 255, 255, 0.08)',
        }
      : {
          background: {
            default: '#f8fafc',
            paper: '#ffffff',
            subtle: '#f1f5f9',
            elevated: '#ffffff',
          },
          text: {
            primary: '#0f172a',
            secondary: '#64748b',
            disabled: '#94a3b8',
          },
          divider: 'rgba(0, 0, 0, 0.08)',
        }),
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.015em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 18px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #1f6b5e 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${PRIMARY_LIGHT} 0%, ${PRIMARY_COLOR} 100%)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundImage: 'none',
          border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          shrink: true,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem',
          fontWeight: 600,
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.85)',
            backgroundColor: mode === 'dark' ? '#131b23' : '#ffffff',
            padding: '0 6px',
            borderRadius: '4px',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: PRIMARY_COLOR,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: PRIMARY_COLOR,
            borderWidth: '2px',
          },
        },
        input: {
          '&::placeholder': {
            color: mode === 'dark' ? '#64748b' : '#94a3b8',
            opacity: 1,
          },
        },
        notchedOutline: {
          borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
});

export const createAppTheme = (mode = 'dark') => createTheme(getDesignTokens(mode));
