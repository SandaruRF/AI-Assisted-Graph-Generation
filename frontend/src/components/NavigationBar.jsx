import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Container,
  Switch,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import UserProfileBtn from "./UserProfileBtn";
import { ThemeContext } from "../ThemeContext";  // Import ThemeContext

const NavigationBar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [jwtExists, setJwtExists] = useState(false);

  const { mode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setJwtExists(!!token); // true if token exists
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false); // close drawer after selection
  };

  const navBtnStyle = {
    textTransform: "none",
    fontWeight: 600,
    color: mode === "light" ? "#045D9F" : "#90caf9",
    fontSize: "1.1rem",
    transition: "all 0.3s ease",
    "&:hover": {
      color: mode === "light" ? "#034A7F" : "#64b5f6",
      textDecoration: "underline",
      textUnderlineOffset: "4px",
    },
  };

  const outlineBtnStyle = {
    textTransform: "none",
    borderRadius: "25px",
    px: 3,
    borderColor: mode === "light" ? "#045D9F" : "#90caf9",
    color: mode === "light" ? "#045D9F" : "#90caf9",
  };

  const filledBtnStyle = {
    textTransform: "none",
    borderRadius: "25px",
    px: 3,
    bgcolor: mode === "light" ? "#045D9F" : "#90caf9",
    "&:hover": {
      bgcolor: mode === "light" ? "#0773c5" : "#64b5f6",
    },
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: mode === "light" ? "#F8F9FD" : "#121212",
          borderBottom: mode === "light" ? "1px solid #e0e0e0" : "1px solid #333",
          boxShadow: "none",
          zIndex: 1000,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img
                src="/images/logo.png"
                alt="VizGen Logo"
                style={{ height: 40, cursor: "pointer" }}
                onClick={() => handleNavigation("/")}
              />
            </Box>

            {/* Desktop Menu */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                flexGrow: 1,
                justifyContent: "center", // center buttons
              }}
            >
              <Box sx={{ display: "flex", gap: 4 }}>
                <Button onClick={() => navigate("/")} sx={navBtnStyle}>
                  Home
                </Button>
                <Button onClick={() => navigate("/existing-connections")} sx={navBtnStyle}>
                  Chat
                </Button>
                <Button onClick={() => handleNavigation("/docs")} sx={navBtnStyle}>
                  Docs
                </Button>
              </Box>
            </Box>

            {/* Dark Mode Toggle */}
            
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <Tooltip title={mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}>
              {mode === "light" ? (
                <Brightness4Icon
                  onClick={toggleTheme}
                  sx={{ cursor: "pointer", color: "#555555" }} // gray in light mode
                />
              ) : (
                <Brightness7Icon
                  onClick={toggleTheme}
                  sx={{ cursor: "pointer", color: "#FFFFFF" }} // white in dark mode
                />
              )}
            </Tooltip>
          </Box>

            {/* Auth Buttons */}
            {jwtExists ? (
              <UserProfileBtn />
            ) : (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate("/login")} sx={outlineBtnStyle}>
                  Login
                </Button>
                <Button variant="contained" onClick={() => navigate("/signup")} sx={filledBtnStyle}>
                  Sign Up
                </Button>
              </Box>
            )}

            {/* Mobile Menu Button */}
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              <MenuIcon sx={{ color: mode === "light" ? "#045D9F" : "#90caf9" }} />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
            bgcolor: mode === "light" ? "#F8F9FD" : "#121212",
            color: mode === "light" ? "black" : "white",
          },
        }}
      >
        <List>
          <ListItem button onClick={() => handleNavigation("/")}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation("/existing-connections")}>
            <ListItemText primary="Chat" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation("/docs")}>
            <ListItemText primary="Docs" />
          </ListItem>

          {jwtExists ? (
            <></>
          ) : (
            <>
              <ListItem button onClick={() => handleNavigation("/login")}>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button onClick={() => handleNavigation("/signup")}>
                <ListItemText primary="Sign Up" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default NavigationBar;
