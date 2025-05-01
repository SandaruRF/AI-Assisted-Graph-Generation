import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container } from "@mui/material";

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => navigate(path);

  return (
    <Box component="header" sx={{ 
      position: "sticky", 
      top: 0, 
      zIndex: 1000, 
      boxShadow: 3, 
      bgcolor: "background.paper", 
      backgroundColor: "#f0f8ff",
      py: 2
    }}>
      <Container>
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          color: "text.primary"
        }}>
          <img 
            src="/images/logo.png" 
            alt="Logo" 
            style={{ height: 40, cursor: "pointer" }}
            onClick={() => handleNavigation("/LandingPage")}
          />
          
          <Box sx={{ display: "flex", gap: 4 }}>
            <Button 
              onClick={() => handleNavigation("/LandingPage")}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Home
            </Button>
            <Button 
              onClick={() => handleNavigation("/graph-visualization")}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Chat
            </Button>
            <Button 
              onClick={() => handleNavigation("/docs")}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Docs
            </Button>
          </Box>
          
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => handleNavigation("/")}
              sx={{ textTransform: "none" }}
            >
              Login
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleNavigation("/sign-up")}
              sx={{ textTransform: "none", bgcolor: "primary.main" }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NavigationBar;