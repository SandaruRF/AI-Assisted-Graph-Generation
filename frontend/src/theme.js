import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#045D9F",
    },
    background: {
      default: "#F8F9FD",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#000000",
    },
    divider: "#e0e0e0",
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid #e0e0e0",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",  // keep as light blue for buttons, highlights
    },
    background: {
      default: "#121212",  // very dark gray, almost black — for page background
      paper: "#272727ff",    // slightly lighter dark for cards/panels
    },
    text: {
      primary: "#FFFFFF",  // white text for readability
    },
    divider: "#333",  // dark divider lines
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid #333",
        },
      },
    },
  },
});
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
        }
      : {
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
        }),
  },
});

