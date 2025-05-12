import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false); // close drawer after selection
  };

  const navBtnStyle = {
    textTransform: "none",
    fontWeight: 600,
    color: "#045D9F",
    fontSize: "1.1rem",
    transition: "all 0.3s ease",
    "&:hover": {
      color: "#034A7F",
      textDecoration: "underline",
      textUnderlineOffset: "4px",
    },
  };

  const outlineBtnStyle = {
    textTransform: "none",
    borderRadius: "25px",
    px: 3,
    borderColor: "#045D9F",
    color: "#045D9F",
  };

  const filledBtnStyle = {
    textTransform: "none",
    borderRadius: "25px",
    px: 3,
    bgcolor: "#045D9F",
    "&:hover": { bgcolor: "#0773c5" },
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#F8F9FD",
          borderBottom: "1px solid #e0e0e0",
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
                justifyContent: "center", // This will center the buttons
              }}
            >
              {/* Nav Buttons */}
              <Box sx={{ display: "flex", gap: 4 }}>
                <Button onClick={() => navigate("/")} sx={navBtnStyle}>
                  Home
                </Button>
                <Button
                  onClick={() => navigate("/existing-connections")}
                  sx={navBtnStyle}
                >
                  Chat
                </Button>
                <Button
                  onClick={() => handleNavigation("/docs")}
                  sx={navBtnStyle}
                >
                  Docs
                </Button>
              </Box>
            </Box>

            {/* Auth Buttons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/login")}
                sx={outlineBtnStyle}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/signup")}
                sx={filledBtnStyle}
              >
                Sign Up
              </Button>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              <MenuIcon sx={{ color: "#045D9F" }} />
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
            bgcolor: "#F8F9FD",
          },
        }}
      >
        <List>
          <ListItem button onClick={() => handleNavigation("/")}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleNavigation("/existing-connections")}
          >
            <ListItemText primary="Chat" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation("/docs")}>
            <ListItemText primary="Docs" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation("/login")}>
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation("/signup")}>
            <ListItemText primary="Sign Up" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default NavigationBar;