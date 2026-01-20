import { createTheme } from '@mui/material/styles';

// Create a custom MUI theme matching the existing design system
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8b5cf6', // --accent-primary (purple)
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    secondary: {
      main: '#06b6d4', // --accent-secondary (cyan)
      light: '#22d3ee',
      dark: '#0891b2',
    },
    error: {
      main: '#dc2626', // --critical
    },
    warning: {
      main: '#f97316', // --high
    },
    info: {
      main: '#3b82f6', // --info
    },
    success: {
      main: '#10b981', // --success
    },
    background: {
      default: '#0f1419', // --bg-primary
      paper: '#1a1f2e', // --bg-secondary
    },
    text: {
      primary: '#e8eaed', // --text-primary
      secondary: '#9aa0a6', // --text-secondary
      disabled: '#5f6368', // --text-muted
    },
    divider: '#3c4257', // --border-color
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      'sans-serif',
    ].join(','),
    fontSize: 14,
  },
  shape: {
    borderRadius: 12, // --radius-lg
  },
  spacing: 8, // Base spacing unit (MUI uses multiples of this)
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#252b3b #1a1f2e',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1a1f2e',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#252b3b',
            borderRadius: '6px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#2d3548',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1a1f2e', // --bg-secondary
          border: '1px solid #3c4257', // --border-color
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: '#2d3548', // --border-light
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1a1f2e', // --bg-secondary
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '8px', // --radius-md
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          color: '#9aa0a6', // --text-secondary
          borderColor: '#3c4257', // --border-color
          '&:hover': {
            backgroundColor: '#252b3b', // --bg-tertiary
          },
          '&.Mui-selected': {
            backgroundColor: '#1a1f2e', // --accent-primary
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#252b3b',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px', // --radius-sm
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.025em',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#252b3b', // --bg-tertiary
            '& fieldset': {
              borderColor: '#3c4257', // --border-color
            },
            '&:hover fieldset': {
              borderColor: '#2d3548',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8b5cf6', // --accent-primary
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#252b3b', // --bg-tertiary
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1f2e', // --bg-secondary
          borderRight: '1px solid #3c4257', // --border-color
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1f2e', // --bg-secondary
          backgroundImage: 'none',
          borderBottom: '1px solid #3c4257', // --border-color
          boxShadow: 'none',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#252b3b', // --bg-tertiary
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#3c4257', // --border-color
        },
        head: {
          fontWeight: 600,
          color: '#e8eaed', // --text-primary
        },
      },
    },
  },
});

// Severity colors helper
export const severityColors = {
  critical: '#dc2626',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  negligible: '#6b7280',
};

// Get severity color by name
export const getSeverityColor = (severity: string): string => {
  const key = severity.toLowerCase() as keyof typeof severityColors;
  return severityColors[key] || severityColors.negligible;
};
