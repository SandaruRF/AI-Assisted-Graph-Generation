import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Import ThemeProvider and createTheme
import App from "./App";



// Create a default theme
const theme = createTheme();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}> {/* Wrap your app with ThemeProvider */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);