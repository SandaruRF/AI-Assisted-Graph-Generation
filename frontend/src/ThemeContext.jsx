// ThemeContext.jsx
import React, { createContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme";

export const ThemeContext = createContext({
  mode: "light",
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  // Persist mode in localStorage so preference remains on refresh
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode === "dark" || savedMode === "light") {
      setMode(savedMode);
    }
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const nextMode = prev === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", nextMode);
      return nextMode;
    });
  };

  const theme = useMemo(() => (mode === "light" ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
