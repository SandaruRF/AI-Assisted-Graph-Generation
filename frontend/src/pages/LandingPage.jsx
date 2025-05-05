import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useInView } from "framer-motion";
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
import AnimationComponent from '../components/AnimationComponent';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';



const LandingPage = () => {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const { scrollYProgress } = useScroll();
  const constraintsRef = useRef(null);

  const navigate = useNavigate();
  

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

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : databaseLogos.length - 1));
  };
  const handleNext = () => {
    setCurrentIndex(prev => (prev < databaseLogos.length - 1 ? prev + 1 : 0));
  };
  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

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
    <Box sx={{ 
      backgroundColor: "#F8F9FD",
      minHeight: "100vh",
      overflow: "hidden"
    }}>
      <NavigationBar />
      <Container 
  maxWidth="lg" // Increased to "lg" for better content spread
  sx={{ 
    pt: { xs: 4, md: 8 },
    pb: { xs: 2, md: 4 },
    display: "flex",
    flexDirection: { xs: "column-reverse", md: "row" }, // Reverse column for better mobile flow
    alignItems: "center",
    justifyContent: "space-between",
    gap: { xs: 4, md: 8 },
    minHeight: { md: "60vh" } // Ensure minimum height for desktop
  }}
>
  {/* Left Content Section */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    style={{
      flex: 1,
      maxWidth: { md: "45%" }, // Slightly less than 50% for better spacing
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }}
  >
    <Typography 
      variant="h1" 
      sx={{ 
        fontWeight: 800,
        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
        lineHeight: 1.2,
        mb: 3,
        textAlign: { xs: "center", md: "left" },
        background: "linear-gradient(90deg, #045D9F, #00B4DB)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}
    >
      AI Assisted Graph Generator
    </Typography>

    <Typography 
      variant="body1" 
      sx={{ 
        mb: 3,
        color: "text.secondary",
        fontSize: { xs: '1rem', md: '1.1rem' },
        lineHeight: 1.7,
        maxWidth: 520,
        mx: { xs: "auto", md: 0 },
        textAlign: { xs: "center", md: "left" }
      }}
    >
      Transform data into easy-to-understand visuals effortlessly with our AI-powered 
      graph generator, designed for impactful data communication. No design skills needed.
    </Typography>

    <Box sx={{ 
      textAlign: { xs: "center", md: "left" },
      mt: 2 
    }}>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
  variant="contained"
  size="large"
  onClick={() => navigate('/')}
  startIcon={<RocketLaunchIcon />} // Add icon from @mui/icons-material
  sx={{ 
    px: 3,
    py: 1,
    fontSize: "1.1rem",
    fontWeight: 600,
    borderRadius: "12px",
    letterSpacing: "0.5px",
    bgcolor: "primary.main",
    color: "white",
    textTransform: "none",
    boxShadow: (theme) => theme.shadows[4],
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    '&:hover': { 
      bgcolor: "primary.dark",
      transform: "translateY(-2px) scale(1.05)",
      boxShadow: (theme) => theme.shadows[6],
    },
    '&:active': {
      transform: "translateY(1px) scale(0.98)",
      boxShadow: (theme) => theme.shadows[2],
    },
    '& .MuiButton-startIcon': {
      mr: 1,
      '& svg': {
        fontSize: "1.4rem",
        transition: "transform 0.3s ease",
      }
    },
    '&:hover .MuiButton-startIcon svg': {
      transform: "rotate(-45deg)"
    }
  }}
>
  Get Started
</Button>
      </motion.div>
    </Box>
  </motion.div>

  {/* Right Animation Section with Shadow Effect */}
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
  whileHover={{ scale: 1.05 }}
  style={{
    flex: 1,
    maxWidth: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: "100%",
  }}
>
  {/* Animated Background Shadow */}
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileHover={{ 
      opacity: 0.4,
      scale: 1.02,
      filter: "blur(15px)",
    }}
    transition={{ 
      duration: 0.3,
      ease: "easeOut"
    }}
    style={{
      position: "absolute",
      width: "95%",
      height: "95%",
      borderRadius: 16,
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      zIndex: 0,
    }}
  />

  <Box
    sx={{
      width: "100%",
      maxWidth: 600,
      height: { xs: 300, md: 400 },
      position: "relative",
      borderRadius: 2,
      overflow: "hidden",
      zIndex: 1,
      '&:hover': {
        boxShadow: 6,
      },
    }}
  >
    <AnimationComponent
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  </Box>
</motion.div>
</Container>


 {/* Features Section */}
<Container sx={{ py: 10 }}>
  <Typography
    variant="h4"
    align="center"
    sx={{
      mb: 6,
      fontWeight: 700,
      background: 'linear-gradient(45deg, #045D9F 30%, #078DEB 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
    }}
  >
    Unlock the Power of AI-Driven Data Visualization
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
            boxShadow: 3 ,
            borderRadius: 4,
            p: 4,
            textAlign: "center",
            transition: "all 0.3s ease",
            height: "100%",
            backgroundColor: '#EAF2F8', // Light blue base color
            '&:hover': {
              transform: "translateY(-8px)",
              boxShadow: "0 8px 24px rgba(4, 93, 159, 0.2)",
              backgroundColor: '#001F3F', // Darker blue on hover
              '& h6, & p': {
                color: 'white'
              }
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
              filter: "brightness(1)",
              transition: "filter 0.3s ease",
              '&:hover': {
                filter: "brightness(1.1)",
              },
            }}
          />
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            mb: 1, 
            color: '#0d47a1' // Dark blue text
          }}>
            {feature.title}
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#191970', // Medium blue text
            lineHeight: 1.6 
          }}>
            {feature.description}
          </Typography>
        </Box>
      </Grid>
    ))}
  </Grid>
</Container>

{/* Image Carousel Section */}
<Container sx={{ 
  py: 8, 
  position: 'relative', 
  overflow: 'hidden',
  '&:hover .carousel-arrow': {
    opacity: 1
  }
}}>
  <Typography variant="h4" align="center" sx={{
    mb: 6,
    fontWeight: 700,
    background: 'linear-gradient(45deg, #045D9F 30%, #078DEB 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
  }}>
    Effortless Database Connections
  </Typography>

  <Box 
    sx={{
      position: 'relative',
      width: '100%',
      maxWidth: 1200,
      mx: 'auto',
    }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    {/* Carousel Track */}
    <Box sx={{
      width: '100%',
      overflow: 'hidden',
      px: 2
    }}>
      <motion.div
        style={{
          display: 'flex',
          willChange: 'transform'
        }}
        animate={{
          x: ['0%', '-100%', '-200%'],
          transition: {
            duration: 30,
            ease: 'linear',
            repeat: Infinity,
          }
        }}
      >
        {[...databaseLogos, ...databaseLogos, ...databaseLogos].map((logo, index) => (
          <Box
            key={`${logo.alt}-${index}`}
            sx={{
              flex: '0 0 33.333%',
              minWidth: '33.333%',
              px: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box sx={{
              width: '100%',
              height: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              border: '2px solid #D6E6F2',
              borderRadius: 3,
              bgcolor: 'background.paper',
              boxShadow: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 4
              }
            }}>
              <Box
                component="img"
                src={logo.src}
                alt={logo.alt}
                sx={{
                  height: 80,
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 8px rgba(4, 93, 159, 0.2))'
                }}
              />
              <Typography variant="subtitle1" sx={{
                mt: 2,
                fontWeight: 600,
                textAlign: 'center',
                color: "text.primary",
                fontSize: '1rem'
              }}>
                {logo.alt}
              </Typography>
            </Box>
          </Box>
        ))}
      </motion.div>
    </Box>

    {/* Edge Fades */}
    <Box sx={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: 100,
      background: 'linear-gradient(90deg, #F8F9FD 20%, transparent 100%)',
      zIndex: 2,
      pointerEvents: 'none'
    }} />
    <Box sx={{
      position: 'absolute',
      width: 'calc(10% + 150px)', // Compensate for fade overlap
      mx: '-100px', // Center the extended width
      top: 0,
      bottom: 0,
      right: 0,
      background: 'linear-gradient(270deg, #F8F9FD 20%, transparent 100%)',
      zIndex: 2,
      pointerEvents: 'none'
    }} />
  </Box>
</Container>
      
{/* How It Works Section */}
<Box sx={{ py: 12, background: "linear-gradient(to bottom, #f8fbff, #ffffff)" }}>
  <Container maxWidth="lg">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
    >
        <Typography
  variant="h4"
  align="center"
  color="#045D9F"
  sx={{
    mb: 6,
    fontWeight: 700,
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  }}
>

        How It Works
      </Typography>

      <Grid container spacing={6} justifyContent="center">
        {[
          // ... your step data array
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
              position: "relative",
              px: 2,
              "&:not(:last-child)::after": {
                content: '""',
                position: "absolute",
                right: 0,
                top: "20%",
                height: "60%",
                width: "1px",
                background: "linear-gradient(to bottom, transparent 0%, #078DEB 50%, transparent 100%)",
                "@media (max-width: 899px)": { display: "none" }
              }
            }}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ position: "relative" }}
              >
                <Box
                  sx={{
                    p: 4,
                    background: "#ffffff",
                    borderRadius: 4,
                    boxShadow: "0 8px 32px rgba(4, 93, 159, 0.1)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: "0 12px 40px rgba(4, 93, 159, 0.2)",
                      "&:before": {
                        opacity: 1
                      }
                    },
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: "linear-gradient(90deg, #045D9F 0%, #078DEB 100%)",
                      opacity: 0,
                      transition: "opacity 0.3s ease"
                    }
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <motion.div 
                      animate={{ y: [0, -8, 0] }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, 15, -15, 0],
                        transition: { duration: 0.5 } 
                      }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          background: "linear-gradient(135deg, #045D9F 0%, #078DEB 100%)",
                          borderRadius: "50%",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 28,
                          mr: 2,
                          boxShadow: "0 4px 12px rgba(4, 93, 159, 0.3)"
                        }}
                      >
                        {step.icon}
                      </Box>
                    </motion.div>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        background: "linear-gradient(45deg, #045D9F 30%, #078DEB 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      }}
                    >
                      {step.title}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: "text.secondary",
                      pl: 7,
                      lineHeight: 1.7,
                      fontSize: "1.05rem"
                    }}
                  >
                    {step.description}
                  </Typography>
                  
                  {/* Animated border effect */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 4,
                      border: "2px solid transparent",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "rgba(4, 93, 159, 0.1)"
                      }
                    }}
                  />
                </Box>
              </motion.div>
            </Box>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  </Container>
</Box>
 {/* Footer */}
<Box
  component="footer"
  sx={{
    mt: 8,
    py: 6,
    bgcolor:"#002244",
    color: "#DDE6ED",
    borderTopLeftRadius: "30px",
    borderTopRightRadius: "30px",
    boxShadow: "inset 0 1px 10px rgba(255,255,255,0.05)",
  }}
>
  <Container>
    <Grid container spacing={4}>
      {/* Logo Section */}
      <Grid item xs={12} md={3}>
          <Box
            component="img"
            src="/images/logo.png"
            alt="Logo"
            sx={{ height: 50, mb: 2 }}
          />
        <Typography variant="body2" sx={{ color: "#ccc", mt: 1 }}>
          Empowering your data with AI-driven insights.
        </Typography>
      </Grid>

      {/* Footer Links */}
      {[
        {
          title: "Features",
          items: ["Connect DB", "Chat"],
        },
        {
          title: "Guides",
          items: ["Docs", "FAQs", "Start Guides"],
        },
        {
          title: "Company",
          items: ["About Us", "Contact Us", "Privacy Policy"],
        },
      ].map((section, index) => (
        <Grid item xs={6} md={3} key={index}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 700, color: "#ffffff" }}
          >
            {section.title}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {section.items.map((item, itemIndex) => (
              <motion.div key={itemIndex} whileHover={{ x: 6 }}>
                <Button
                  sx={{
                    justifyContent: "flex-start",
                    color: "#b0c4de",
                    textTransform: "none",
                    px: 0,
                    '&:hover': {
                      backgroundColor: "transparent",
                      color: "#00BFFF",
                    },
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

    {/* Social Icons (optional) */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        gap: 2,
        color: "#ccc",
      }}
    >
      <motion.div whileHover={{ scale: 1.2 }}>
        <i className="fab fa-facebook-f" style={{ fontSize: 20 }} />
      </motion.div>
      <motion.div whileHover={{ scale: 1.2 }}>
        <i className="fab fa-twitter" style={{ fontSize: 20 }} />
      </motion.div>
      <motion.div whileHover={{ scale: 1.2 }}>
        <i className="fab fa-linkedin-in" style={{ fontSize: 20 }} />
      </motion.div>
    </Box>

    {/* Bottom Text */}
    <Typography
      variant="body2"
      align="center"
      sx={{ mt: 4, color: "#A9A9A9", fontSize: "0.875rem" }}
    >
      © 2025 VizeGen. All Rights Reserved.
    </Typography>
  </Container>
</Box>

    </Box>
  );
};

export default LandingPage;