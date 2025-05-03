import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  IconButton,
} from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import NavigationBar from "../components/NavigationBar";

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const { scrollYProgress } = useScroll();
  const constraintsRef = useRef(null);

  const databaseLogos = [
    { src: "/images/mysql.png", alt: "MySQL" },
    { src: "/images/postgresql.png", alt: "PostgreSQL" },
    { src: "/images/mariadb.png", alt: "MariaDB" },
    { src: "/images/sqlserver.png", alt: "SQL Server" },
    { src: "/images/oracle.png", alt: "Oracle" },
    { src: "/images/SQLite.png", alt: "SQLite" },
  ];

  // Auto-rotation and touch handlers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev < databaseLogos.length - 1 ? prev + 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) handleNext();
    if (touchStart - touchEnd < -50) handlePrev();
  };

  const handlePrev = () => setCurrentIndex(prev => prev > 0 ? prev - 1 : databaseLogos.length - 1);
  const handleNext = () => setCurrentIndex(prev => prev < databaseLogos.length - 1 ? prev + 1 : 0);
  const handleDotClick = (index) => setCurrentIndex(index);

  const FeatureSection = ({ title, description, image, reverse = false }) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
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
              <motion.div whileHover={{ scale: 1.05 }}>
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
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Scroll Progress Indicator */}
      <motion.div
        style={{
          scaleX: scrollYProgress,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "primary.main",
          zIndex: 9999
        }}
      />

      <Box sx={{ backgroundColor: "#f0f8ff" }}>  
        <NavigationBar />

        {/* Hero Section */}
        <Container sx={{ py: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  AI Assisted
                  <Box component="span" sx={{ color: "primary.main" }}> Graph Generator</Box>
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, color: "text.secondary" }}>
                  Transform data into easy-to-understand visuals effortlessly with our AI-powered graph generator, designed for impactful data communication. No design skills needed.
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/")}
                    sx={{ px: 6, py: 1.5, fontSize: "1.1rem" }}
                  >
                    Get Started
                  </Button>
                </motion.div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <img
                    src="/images/hero-graph.png"
                    alt="AI Generated Graph"
                    style={{ width: "100%", height: "auto" }}
                  />
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      <Container sx={{ py: 8 }}>
  <Typography variant="h4" align="center" gutterBottom sx={{ mb: 6, fontWeight: 700 }}>
    Connect Seamlessly to Your Favorite Databases
  </Typography>

  <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
    <Box sx={{ 
      display: "flex", 
      transition: "transform 0.3s", 
      transform: `translateX(-${currentIndex * 100}%)`
    }}>
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

    {/* Auto-rotate functionality */}
    {useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev < databaseLogos.length - 1 ? prev + 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }, [])}

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
                 
      <Container sx={{ py: 10}}>

        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 6, fontWeight: 700 }}>
          Transform Data with Powerful AI Features
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: "AI Diagram Generator",
              description:
                "Convert your raw data into sleek, interactive graphs with a few simple prompts. Skip the design struggle and get polished visuals instantly.",
              image: "/images/ai.png",
            },
            {
              title: "Multi-Database Compatibility",
              description:
                "Connect easily with SQLite, MySQL, PostgreSQL, and more for flexible, secure, and scalable data integration across any environment.",
              image: "/images/db-compatibility.png",
            },
            {
              title: "Advanced Data Protection",
              description:
                "Your data is safe with bank-grade encryption, multi-layer authentication, and real-time threat detection ensuring complete privacy.",
              image: "/images/security.png",
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box
                sx={{
                  borderRadius: 4,
                  boxShadow: 3,
                  p: 4,
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  height: "100%",
                  backgroundColor: "#f0f8ff",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                    bgcolor: "#cce5ff",
                  },
                }}
              >
                <Box
                  component="img"
                  src={feature.image}
                  alt={feature.title}
                  sx={{
                    height: 120,
                    width: "auto",
                    mb: 3,
                    objectFit: "contain",
                    
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>


      {/* How It Works Section */}
      <Box sx={{ py: 12, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                mb: 8,
                position: 'relative',
                '&::after': {
                  content: '""',
                  display: 'block',
                  width: 60,
                  height: 4,
                  bgcolor: 'primary.main',
                  mx: 'auto',
                  mt: 2,
                }
              }}
            >
              How It Works
            </Typography>

            <Grid container spacing={6} justifyContent="center">
              {[
                {
                  title: "Create Account",
                  description: "Set up your personalized account in less than 2 minutes with email verification",
                  icon: '👤'
                },
                {
                  title: "Connect Your Database",
                  description: "Securely integrate your database with our platform using industry-standard protocols",
                  icon: '🔗'
                },
                {
                  title: "Chat with It", 
                  description: "Interact naturally with our AI assistant to generate and refine your visualizations",
                  icon: '💬'
                }
              ].map((step, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box sx={{ 
                    position: 'relative',
                    px: 2,
                    '&:not(:last-child)::after': {
                      content: '""',
                      position: 'absolute',
                      right: 0,
                      top: '20%',
                      height: '60%',
                      width: '1px',
                      bgcolor: 'divider',
                      '@media (max-width: 899px)': { display: 'none' }
                    }
                  }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <motion.div 
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ type: "spring" }}
                        >
                          <Box sx={{
                            width: 48,
                            height: 48,
                            bgcolor: 'primary.main',
                            borderRadius: '50%',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                            mr: 2
                          }}>
                            {step.icon}
                          </Box>
                        </motion.div>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {step.title}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ 
                        color: 'text.secondary',
                        pl: 6,
                        lineHeight: 1.6
                      }}>
                        {step.description}
                      </Typography>
                    </motion.div>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ mt: 8, py: 6, bgcolor: "grey.100" }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <motion.div whileHover={{ rotate: [0, 10, -10, 0] }}>
                <Box component="img" 
                  src="/images/logo.png" 
                  alt="Logo" 
                  sx={{ height: 40, mb: 2 }}
                />
              </motion.div>
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
                    <motion.div key={itemIndex} whileHover={{ x: 5 }}>
                      <Button 
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
                    </motion.div>
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