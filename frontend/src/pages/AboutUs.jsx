import React from 'react';
import { motion } from "framer-motion";
import { Box, Typography, Grid } from '@mui/material';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import { useTheme } from '@mui/material/styles';

const AboutUs = () => {
  const theme = useTheme();
  return (
    <Box sx={{ minHeight: '100vh', color: theme.palette.text.primary, 
      backgroundColor: theme.palette.background.default, paddingBottom: 4
     }}>
      <NavigationBar />

      {/* Hero Section */}
<Box sx={{ 
  position: 'relative',
  height: '70vh',
  minHeight: '400px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#03224C',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(3, 34, 76, 0.6) 0%, rgba(3, 34, 76, 0.3) 100%)',
    zIndex: 1,
    pointerEvents: 'none'
  }
}}>
  <Box
    component="img"
    src="/images/Background.png"
    alt="Background"
    sx={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center 30%',
      filter: 'brightness(0.9) contrast(1.1)',
      opacity: 0.4
    }}
  />

  <Box sx={{
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    px: 2,
    maxWidth: '1200px',
    margin: '0 auto',
    color: theme.palette.background.default
  }}>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 900,
          fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
          letterSpacing: { xs: '0.03em', md: '0.05em' },
          mb: 2,
          textShadow: '0 4px 12px rgba(0,0,0,0.3)',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '30%',
            height: '4px',
            background:theme.palette.background.default,
            //background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, #FFFFFF 50%, rgba(255,255,255,0) 100%)',
            animation: 'underlineExpand 0.8s ease-out forwards',
            '@keyframes underlineExpand': {
              '0%': { width: '0%' },
              '100%': { width: '30%' }
            }
          }
        }}
      >
        ABOUT US
      </Typography>
    </motion.div>

   
  </Box>
</Box>

      {/* Main Content Container */}
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        p: { xs: 3, md: 4 },
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(4,93,159,0.05) 0%, transparent 70%)',
          zIndex: -1
        }
      }}>
        {/* Empowering Insights Section */}
<Grid
  container
  spacing={2}
  alignItems="center"
  direction="row"
  sx={{ flexWrap: 'nowrap', px: { xs: 0, md: 2 }, py: { xs: 4, md: 10 }, ml: { md: -4 },backgroundColor: theme.palette.background.default }}
>
  {/* Text Column - Left */}
  <Grid item xs={12} md={4}>
    <Box sx={{ pr: { md: 2 }, ml: { md: -4 }, maxWidth: '90%' ,backgroundColor: theme.palette.background.default}}> {/* Reduced box width */}
      <Typography
        variant="h3"
        sx={{
          mb: 3,
          fontWeight: 800,
          color: '#033E6B',
          lineHeight: 1.2,
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: '-12px',
            left: 0,
            width: '80px',
            height: '4px',
            background: 'linear-gradient(90deg, #00B4DB 0%, #045D9F 100%)',
            borderRadius: 2,
          },
        }}
      >
        Empowering Insights Through AI-Driven Charts
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: (theme) => theme.palette.text.primary,
          lineHeight: 1.8,
          fontSize: '1.1rem',
          borderLeft: '3px solid #078DEB',
          pl: 2,
        }}
      >
        We are a team of passionate innovators building an intelligent assistant that transforms
        data into smart, interactive charts. With the power of AI, we make data storytelling
        effortless for everyone.
      </Typography>
    </Box>
  </Grid>

  {/* Image Column - Right */}
  <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'flex-start' }}> {/* Adjusted to left-align */}
    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Box
        component="img"
        src="/images/hero-graph.png"
        alt="AI Charts"
        sx={{
          width: '140%',
          maxWidth: 'none',
          height: 'auto',
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(4,93,159,0.15)',
          border: '3px solid white',
          ml: '-20%'  // Moved further left
        }}
      />
    </motion.div>
  </Grid>
</Grid>


{/*mission vision*/}

       <Box sx={{ 
  position: 'relative',
  mb: { xs: 6, md: 6 },
  '&:before': {
    content: '""',
    position: 'absolute',
    bottom: '-50px',
    right: '-100px',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(37, 247, 9, 0.05) 0%, transparent 70%)',
    zIndex: -1
  }
}}>
          <Grid 
    container 
    spacing={4} 
    sx={{ 
      flexWrap: 'nowrap', 
      overflowX: 'unset'  // allows scrolling on small screens
    }}
  >
    {/* Mission Card */}
    <Grid item xs={12} md={6} sx={{ minWidth: '50%' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
                 <Box sx={{
          height: '100%',
          p: { xs: 3, md: 4 },
          backgroundColor: theme.palette.background.default,
          borderRadius: 4,
          boxShadow: '0 8px 24px rgba(4,93,159,0.08)',
          border: '1px solid rgba(4,93,159,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 32px rgba(4,93,159,0.12)'
          }
        }}>
                 <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            gap: 2.5
          }}>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
                      <Box sx={{
                width: 60,
                height: 60,
                bgcolor: theme.palette.background.default,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(45deg, transparent 0%, rgba(4,93,159,0.05) 100%)',
                }
              }}>
                        <motion.div
                  animate={{
                    y: [-3, 3, -3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    position: 'relative',
                    width: 32,
                    height: 32
                  }}
                >
                           <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: '16px',
                      height: '16px',
                      bgcolor: '#045D9F',
                      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                      transform: 'translate(-50%, -50%)'
                    },
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: '24px',
                      height: '2px',
                      bgcolor: '#045D9F',
                      transform: 'translate(-50%, -50%) rotate(45deg)'
                    }
                  }} />
                        </motion.div>
                      </Box>
                    </motion.div>
  <Typography variant="h4" sx={{ 
              fontWeight: 700,
              color: '#045D9F',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: 0,
                width: '60px',
                height: '3px',
                background: 'linear-gradient(90deg, #00B4DB 0%, #045D9F 100%)',
                borderRadius: 2
              }
            }}>
              Mission
            </Typography>
                 </Box>
          <Typography variant="body1" sx={{ 
            color: (theme) => theme.palette.text.primary,
            lineHeight: 1.8,
            fontSize: '1rem',
            pl: 1.5
          }}>
                    Our mission is to simplify data visualization by using AI to automatically understand user 
                    intent and generate the most suitable charts. We strive to make data insights more accessible, 
                    accurate, and engaging for users of all backgrounds.
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            {/* Vision Card */}
             <Grid item xs={12} md={6} sx={{ minWidth: '50%' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
                 <Box sx={{
          height: '100%',
          p: { xs: 3, md: 4 },
          backgroundColor: theme.palette.background.default,
          borderRadius: 4,
          boxShadow: '0 8px 24px rgba(4,93,159,0.08)',
          border: '1px solid rgba(4,93,159,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 32px rgba(4,93,159,0.12)'
          }
        }}>
                 <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            gap: 2.5
          }}>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
                      <Box sx={{
                width: 60,
                height: 60,
                bgcolor: theme.palette.background.default,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background:theme.palette.background.default
                  //background: 'linear-gradient(45deg, transparent 0%, rgba(4,93,159,0.05) 100%)',
                }
              }}>
                        <motion.div
                  animate={{
                    y: [-3, 3, -3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    position: 'relative',
                    width: 32,
                    height: 32
                  }}
                >
                           <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: '16px',
                      height: '16px',
                      bgcolor: '#045D9F',
                      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                      transform: 'translate(-50%, -50%)'
                    },
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: '24px',
                      height: '2px',
                      bgcolor: '#045D9F',
                      transform: 'translate(-50%, -50%) rotate(45deg)'
                    }
                  }} />
                        </motion.div>
                      </Box>
                    </motion.div>
                    <Typography variant="h4" sx={{ 
              fontWeight: 700,
              color: '#045D9F',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: 0,
                width: '60px',
                height: '3px',
                background:theme.palette.background.default,
                //background: 'linear-gradient(90deg, #00B4DB 0%, #045D9F 100%)',
                borderRadius: 2
              }
            }}>
                      Vision
                    </Typography>
                  </Box>
          <Typography variant="body1" sx={{ 
            color: (theme) => theme.palette.text.primary,
            lineHeight: 1.8,
            fontSize: '1rem',
            pl: 1.5
          }}>
                    To become a leading AI-powered platform that bridges the gap between complex data and meaningful 
                    visualizations. We envision a future where everyone can interact with data intuitively and make 
                    smarter decisions, powered by intelligent chart recommendations.
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default AboutUs;