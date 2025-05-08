// NavigationBar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => navigate(path);

  return (
    
    <Box component="header" sx={{ 
      position: "sticky", 
      top: 0, 
      zIndex: 1000, 
     backgroundColor: "#F8F9FD",
      py: 2,
      borderBottom: "1px solid #e0e0e0"
    }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          gap: 4
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img 
              src="/images/logo.png" 
              alt="VizGen Logo" 
              style={{ height: 40, cursor: "pointer" }}
              onClick={() => handleNavigation("/")}
            />
            
          </Box>
          
          <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
  <Button 
    onClick={() => navigate('/LandingPage')}
    sx={{ 
      textTransform: "none", 
      fontWeight: 600,
      color: "#045D9F",
      fontSize: "1.1rem", // Increased font size
      transition: "all 0.3s ease",
      '&:hover': { 
        color: "#034A7F",
        textDecoration: "underline",
        textUnderlineOffset: "4px"
      }
    }}
  >
    Home
  </Button>
  <Button 
   onClick={() => navigate('/graph-visualization')}
    sx={{ 
      textTransform: "none", 
      fontWeight: 600,
      color: "#045D9F",
      fontSize: "1.1rem", // Increased font size
      transition: "all 0.3s ease",
      '&:hover': { 
        color: "#034A7F",
        textDecoration: "underline",
        textUnderlineOffset: "4px"
      }
    }}
  >
    Chat
  </Button>
  <Button 
    onClick={() => handleNavigation("/docs")}
    sx={{ 
      textTransform: "none", 
      fontWeight: 600,
      color: "#045D9F",
      fontSize: "1.1rem", // Increased font size
      transition: "all 0.3s ease",
      '&:hover': { 
        color: "#034A7F",
        textDecoration: "underline",
        textUnderlineOffset: "4px"
      }
    }}
  >
    Docs
  </Button>
</Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/')}
              sx={{ 
                textTransform: "none",
                borderRadius: "25px",
                px: 3,
                borderColor:  "#045D9F",
                color:  "#045D9F"
               
              }}
            >
              Login
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/sign-up')}
              sx={{ 
                textTransform: "none", 
                borderRadius: "25px",
                px: 3,
                bgcolor:  "#045D9F",
                '&:hover': { bgcolor: "#0773c5" }
              }}
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