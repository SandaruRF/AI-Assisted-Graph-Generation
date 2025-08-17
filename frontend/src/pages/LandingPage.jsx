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
import NavigationBar from "../components/NavigationBar";
import AnimationComponent from "../components/AnimationComponent";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Footer from "../components/Footer";
import { useTheme } from "@mui/material/styles";


const LandingPage = () => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const { scrollYProgress } = useScroll();
  const constraintsRef = useRef(null);

  const navigate = useNavigate();
  const lightBg = "linear-gradient(90deg, #F8F9FD 20%, transparent 100%)";
  const darkBg = "linear-gradient(90deg, #111111ff 20%, transparent 100%)";
  const gradientLight = "linear-gradient(90deg, #045D9F, #00B4DB)";
  const gradientDark = "linear-gradient(90deg, #90caf9, #64b5f6)";

  const databaseLogos = [
    { src: "/images/mysql.png", alt: "MySQL" },
    { src: "/images/postgresql.png", alt: "PostgreSQL" },
    { src: "/images/mariadb.png", alt: "MariaDB" },
    { src: "/images/sqlserver.png", alt: "SQL Server" },
    { src: "/images/oracle.png", alt: "Oracle" },
    { src: "/images/SQLite.png", alt: "SQLite" },
    { src: "/images/RedShift.png", alt: "Redshift" },
  ];

  // Auto-rotation and touch handlers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev < databaseLogos.length - 1 ? prev + 1 : 0
      );
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
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : databaseLogos.length - 1));
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < databaseLogos.length - 1 ? prev + 1 : 0));
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
          <Grid
            container
            spacing={4}
            direction={reverse ? "row-reverse" : "row"}
          >
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ color: "primary.main", fontWeight: 600 }}
                >
                  {title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
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
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
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
          minHeight: { md: "60vh" }, // Ensure minimum height for desktop
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
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h1"
            sx={{
                fontWeight: 800,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "3.5rem" },
                lineHeight: 1.2,
                mb: 3,
                textAlign: { xs: "center", md: "left" },
                background: theme.palette.mode === "light" ? gradientLight : gradientDark,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
          >
            AI Assisted Graph Generator
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: "text.secondary",
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.7,
              maxWidth: 520,
              mx: { xs: "auto", md: 0 },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Transform data into easy-to-understand visuals effortlessly with our
            AI-powered graph generator, designed for impactful data
            communication. No design skills needed.
          </Typography>

          <Box
            sx={{
              textAlign: { xs: "center", md: "left" },
              mt: 2,
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/")}
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
                  "&:hover": {
                    bgcolor: "primary.dark",
                    transform: "translateY(-2px) scale(1.05)",
                    boxShadow: (theme) => theme.shadows[6],
                  },
                  "&:active": {
                    transform: "translateY(1px) scale(0.98)",
                    boxShadow: (theme) => theme.shadows[2],
                  },
                  "& .MuiButton-startIcon": {
                    mr: 1,
                    "& svg": {
                      fontSize: "1.4rem",
                      transition: "transform 0.3s ease",
                    },
                  },
                  "&:hover .MuiButton-startIcon svg": {
                    transform: "rotate(-45deg)",
                  },
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
              ease: "easeOut",
            }}
           style={{
              position: "absolute",
              width: "95%",
              height: "95%",
              borderRadius: 16,
              backgroundColor:
                theme.palette.mode === "light"
                  ? "rgba(0, 0, 0, 0.2)"    // dark overlay in light mode
                  : "rgba(255, 255, 255, 0.1)", // light overlay in dark mode
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
              "&:hover": {
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
      <Container
        maxWidth="xl"
        sx={{
          py: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 6,
            fontWeight: 700,
            background: "linear-gradient(45deg, #045D9F 30%, #078DEB 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          Unlock the Power of AI-Driven Data Visualization
        </Typography>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
        >
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
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  boxShadow: 3,
                  borderRadius: 4,
                  p: 4,
                  backgroundColor: theme.palette.mode === "light" ? "#EAF2F8" : "#121212",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 8px 24px rgba(4, 93, 159, 0.2)",
                    backgroundColor: theme.palette.mode === "light" ? "#001F3F" : "#333",
                    "& h6, & p": {
                      color: "white",
                    },
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
                    "&:hover": {
                      filter: "brightness(1.1)",
                    },
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: "#0d47a1",
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#191970",
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/*image carousel*/}
      <Container
        sx={{
          py: 8,
          position: "relative",
          overflow: "hidden",
          "&:hover .carousel-arrow": {
            opacity: 1,
          },
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 6,
            fontWeight: 700,
            background: "linear-gradient(45deg, #045D9F 30%, #078DEB 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          Effortless Database Connections
        </Typography>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Carousel Track */}
          <Box
            sx={{
              width: "100%",
              overflow: "hidden",
              px: 2,
            }}
          >
            <motion.div
              style={{
                display: "flex",
                willChange: "transform",
              }}
              animate={{
                x: "-300%",
                transition: {
                  duration: 60, // Slower duration for better sync
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop",
                },
              }}
            >
              {[
                ...databaseLogos,
                ...databaseLogos,
                ...databaseLogos,
                ...databaseLogos,
                ...databaseLogos,
              ].map((logo, index) => (
                <Box
                  key={`${logo.alt}-${index}`}
                  sx={{
                    flex: "0 0 33.333%",
                    minWidth: "33.333%",
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: 200,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 2,
                      border: "2px solid #D6E6F2",
                      borderRadius: 3,
                      bgcolor: "background.paper",
                      boxShadow: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={logo.src}
                      alt={logo.alt}
                      sx={{
                        height: 140,
                        width: "auto",
                        maxWidth: "85%",
                        objectFit: "contain",
                        filter: "drop-shadow(0 4px 8px rgba(4, 93, 159, 0.2))",
                        mb: 2,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </motion.div>
          </Box>
          

          {/* Enhanced Edge Fades */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: 100,
              background:
                "linear-gradient(90deg, #F8F9FD 20%, transparent 100%)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: 100,
                background: theme.palette.mode === "light" ? lightBg : darkBg,
                zIndex: 2,
                pointerEvents: "none",
      }}
          />
        </Box>
      </Container>

      {/* How It Works Section */}
      <Box
        sx={{
          py: 12,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ width: "100%" }}>
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

            <Grid
              container
              spacing={4}
              sx={{
                width: "100%",
                margin: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "stretch",
                flexWrap: "nowrap",
              }}
            >
              {[
                // ... your step data array
                {
                  title: "Create Account",
                  description:
                    "Set up your personalized account in less than 2 minutes with email verification",
                  icon: "👤",
                },
                {
                  title: "Connect Your Database",
                  description:
                    "Securely integrate your database with our platform using industry-standard protocols",
                  icon: "🔗",
                },
                {
                  title: "Chat with It",
                  description:
                    "Interact naturally with our AI assistant to generate and refine your visualizations",
                  icon: "💬",
                },
              ].map((step, index) => (
                <Grid
                  item
                  xs={12}
                  md={4}
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      position: "relative",
                      px: 2,
                      "&:not(:last-child)::after": {
                        content: '""',
                        position: "absolute",
                        right: 0,
                        top: "20%",
                        height: "60%",
                        width: "1px",
                        background:
                          "linear-gradient(to bottom, transparent 0%, #078DEB 50%, transparent 100%)",
                        "@media (max-width: 899px)": { display: "none" },
                      },
                    }}
                  >
                    <motion.div
                      whileHover={{ y: -10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      style={{ position: "relative" }}
                    >
                      <Box
                        sx={{
                          p: 4,
                          backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#121212",
                          borderRadius: 4,
                          boxShadow: "0 8px 32px rgba(4, 93, 159, 0.1)",
                          transition: "all 0.3s ease",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            boxShadow: "0 12px 40px rgba(4, 93, 159, 0.2)",
                            "&:before": {
                              opacity: 1,
                            },
                          },
                          "&:before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background:
                              "linear-gradient(90deg, #045D9F 0%, #078DEB 100%)",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                          },
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 3 }}
                        >
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            whileHover={{
                              scale: 1.1,
                              rotate: [0, 15, -15, 0],
                              transition: { duration: 0.5 },
                            }}
                          >
                            <Box
                              sx={{
                                width: 64,
                                height: 64,
                                background:
                                  "linear-gradient(135deg, #045D9F 0%, #078DEB 100%)",
                                borderRadius: "50%",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 28,
                                mr: 2,
                                boxShadow: "0 4px 12px rgba(4, 93, 159, 0.3)",
                              }}
                            >
                              {step.icon}
                            </Box>
                          </motion.div>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              background:
                                "linear-gradient(45deg, #045D9F 30%, #078DEB 90%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
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
                            fontSize: "1.05rem",
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
                              borderColor: "rgba(4, 93, 159, 0.1)",
                            },
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
      <Footer />
    </Box>
  );
};

export default LandingPage;
