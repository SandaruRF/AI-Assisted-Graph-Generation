import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import NavigationBar from "../components/NavigationBar";

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const databaseLogos = [
    { src: "/images/mysql.png", alt: "MySQL" },
    { src: "/images/postgresql.png", alt: "PostgreSQL" },
    { src: "/images/mariadb.png", alt: "MariaDB" },
    { src: "/images/sqlserver.png", alt: "SQL Server" },
    { src: "/images/oracle.png", alt: "Oracle" },
    { src: "/images/SQLite.png", alt: "SQLite" },
  ];

  
  const handlePrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : databaseLogos.length - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev < databaseLogos.length - 1 ? prev + 1 : 0));
  const handleDotClick = (index) => setCurrentIndex(index);

  const FeatureSection = ({ title, description, image, reverse = false }) => (
    <Box sx={{ mb: 8 }}>
      <Grid container spacing={4} direction={reverse ? "row-reverse" : "row"}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography variant="h5" gutterBottom sx={{ color: "primary.main", fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
              {description}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <img
            src={image}
            alt={title}
            style={{
              width: 350,
              height: 350,
              maxHeight: 400,
              objectFit: "contain",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box sx={{ backgroundColor: "#f0f8ff" }}>  
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Hero Section */}
      <Container sx={{ py: 8 }}>
        
        <Grid container spacing={4} alignItems="center"  >
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              AI Assisted
              <Box component="span" sx={{ color: "primary.main" }}> Graph Generator</Box>
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: "text.secondary" }}>
            Transform data into easy-to-understand visuals effortlessly with our AI-powered graph generator, designed for impactful data communication. No design skills needed.
            </Typography>
            <Button
    variant="contained"
    size="large"
    onClick={() => navigate("/")}
    sx={{ px: 6, py: 1.5, fontSize: "1.1rem" }}
  >
    Get Started
  </Button>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <img
              src="/images/hero-graph.png"
              alt="AI Generated Graph"
              style={{ width: "100%", height: "auto" }}
            />
          </Grid>
        </Grid>
      </Container>
      </Box>

            {/* Database Carousel Section */}
            <Container sx={{ py: 8 }}>
  <Typography variant="h4" align="center" gutterBottom sx={{ mb: 6 }}>
  Connect Seamlessly to Your Favorite Databases
  </Typography>

  <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
    <Box sx={{ display: "flex", transition: "transform 0.3s", transform: `translateX(-${currentIndex * 100}%)` }}>
      {databaseLogos.map((db) => (
        <Box key={db.alt} sx={{ flex: "0 0 100%", minWidth: "100%", p: 2, textAlign: "center" }}>
          <Box
            component="img"
            src={db.src}
            alt={db.alt}
            sx={{
              height: 120,
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              transition: "transform 0.3s",
              "&:hover": { 
                transform: "scale(1.05)",
              },
            }}
          />
        </Box>
      ))}
    </Box>

          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": { bgcolor: "primary.main", color: "white" },
            }}
          >
            <ChevronLeft fontSize="large" />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": { bgcolor: "primary.main", color: "white" },
            }}
          >
            <ChevronRight fontSize="large" />
          </IconButton>

          <Box sx={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 1 }}>
            {databaseLogos.map((_, index) => (
              <Box
                key={index}
                onClick={() => handleDotClick(index)}
                sx={{
                  width: 10,
                  height: 1,
                  borderRadius: "50%",
                  bgcolor: currentIndex === index ? "primary.main" : "action.selected",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>


      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 6 }}>
          Transform data into visuals with AI graphs
        </Typography>
        <FeatureSection
          title="AI Diagram Generator"
          description="Instantly convert your raw data into sleek, interactive graphs. From brainstorming sessions to client presentations, achieve professional results without the hassle of manual creation. All you need are a few simple prompts"
          image="/images/ai.png"
        />

        <FeatureSection
          title="Seamless Multi-Database Compatibility"
          description="Effortlessly connect with SQLite, MySQL, and PostgreSQL for flexible and scalable data management. Whether you need lightweight local storage, high-speed transactions, or advanced data handling, our platform adapts to your needs—powering your data like never before!"
          image="/images/db-compatibility.png"
          reverse
        />

        <FeatureSection
          title="Fortified Data Protection"
          description="Your data’s security is our top priority! With bank-grade encryption, multi-layer authentication, and proactive threat monitoring, we ensure your information remains safe, private, and uncompromised."
          image="/images/security.png"
        />
      </Container>

    
      <Box sx={{ py: 12, bgcolor: 'background.paper' }}> {/* Full-width section */}
  <Container>
    <Typography variant="h3" align="center" gutterBottom sx={{ 
      mb: 10, 
      fontWeight: 800,
      fontSize: '2.5rem'
    }}>
      How It Works
    </Typography>

    <Box sx={{
      position: 'relative',
      width: '100%',
      maxWidth: 1400,
      margin: '0 auto',
      borderRadius: 4,
      overflow: 'hidden'
    }}>
      <img
        src="/images/work cycle.png"
        alt="work cycle"
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'contain'
        }}
      />
    </Box>
  </Container>
</Box>

      {/* Footer */}
     
<Box component="footer" sx={{ mt: 8, py: 6, bgcolor: "grey.100" }}>
  <Container>
    <Grid container spacing={4}>
      <Grid item xs={12} md={3}>
        <Box component="img" 
          src="/images/logo.png" 
          alt="Logo" 
          sx={{ height: 40, mb: 2 }}
        />
        
      </Grid>

      {[
        { 
          title: "Features",
          items: ["Connect DB", "Chat"]
        },
        {
          title: "Guides",
          items: ["Docs", "FAQs", "Start Guides"]
        },
        {
          title: "Company",
          items: ["About Us", "Contact Us", "Privacy Policy"]
        }
      ].map((section, index) => (
        <Grid item xs={6} md={3} key={index}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {section.title}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {section.items.map((item, itemIndex) => (
              <Button 
                key={itemIndex} 
                sx={{ 
                  justifyContent: 'flex-start',
                  color: 'text.primary',
                  textTransform: 'none',
                  px: 0,
                  '&:hover': { 
                    backgroundColor: 'transparent',
                    color: 'primary.main'
                  }
                }}
              >
                {item}
              </Button>
            ))}
          </Box>
        </Grid>
      ))}
    </Grid>

    <Typography 
      variant="body2" 
      align="center" 
      sx={{ 
        mt: 4, 
        color: 'text.secondary',
        fontSize: '0.875rem'
      }}
    >
      © 2025 VizeGen. All Rights Reserved
    </Typography>
  </Container>
</Box>
    </Box>
  );
};

export default LandingPage;