// src/pages/AboutUs.jsx
import React from 'react';
import { motion } from "framer-motion";
import { Box, Typography, Grid, Divider } from '@mui/material';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';

const AboutUs = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8F9FD' }}>
      <NavigationBar />

    {/*Hero section*/}
  
<Box sx={{ 
  position: 'relative',
  height: '500px',
  overflow: 'hidden',
  mb: 8,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%)',
    zIndex: 1
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
      filter: 'brightness(1.05) saturate(1.05) contrast(1.05)'
    }}
  />
  <Box sx={{
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    px: 2
  }}>
<Typography 
  variant="h2" 
  sx={{ 
    fontWeight: 800,
    background: 'linear-gradient(45deg, #045D9F 30%, #00B4DB 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: { xs: '2.75rem', md: '4rem' },
    maxWidth: '800px',
    mx: 'auto',
    letterSpacing: { xs: '0.03em', md: '0.05em' },
    p: 4,
    position: 'relative',
    textAlign: 'center',
    textShadow: '0 4px 8px rgba(0,0,0,0.1)',
    '&:before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(8px)',
      zIndex: -1
    }
  }}
>
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    About Us
  </motion.div>
</Typography>
  </Box>
</Box>
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
  <Grid container spacing={6} alignItems="center" sx={{ 
    mb: { xs: 6, md: 10 },
    position: 'relative'
  }}>
    <Grid item xs={12} md={6} sx={{ 
      order: { xs: 2, md: 1 },
      pr: { md: 6 } 
    }}>
      <Typography variant="h3" sx={{ 
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
          borderRadius: 2
        }
      }}>
        Empowering Insights Through AI-Driven Charts
      </Typography>
      <Typography variant="body1" sx={{ 
        color: '#4A4A4A',
        lineHeight: 1.8,
        fontSize: '1.1rem',
        pl: 1.5,
        borderLeft: '3px solid #078DEB'
      }}>
        We are a team of passionate innovators building an intelligent assistant that transforms data 
        into smart, interactive charts. With the power of AI, we make data storytelling effortless 
        for everyone.
      </Typography>
    </Grid>
    
    <Grid item xs={12} md={6} sx={{ 
      order: { xs: 1, md: 2 },
      textAlign: { xs: 'center', md: 'right' } 
    }}>
      <motion.div 
        whileHover={{ scale: 1.03 }} 
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Box
          component="img"
          src="/images/hero-graph.png"
          alt="AI Charts"
          sx={{
            width: '90%',
            maxWidth: '550px',
            height: 'auto',
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(4,93,159,0.15)',
            border: '3px solid white'
          }}
        />
      </motion.div>
    </Grid>
  </Grid>

  {/* Mission & Vision Section */}
  <Grid container spacing={6} alignItems="center" sx={{ 
    mb: { xs: 6, md: 10 },
    position: 'relative',
    flexDirection: { xs: 'column-reverse', md: 'row' }
  }}>
    <Grid item xs={12} md={5} sx={{ 
      pr: { md: 6 },
      mt: { xs: 4, md: 0 }
    }}>
      <motion.div 
        whileHover={{ 
          scale: 1.03,
          boxShadow: '0 20px 40px rgba(4,93,159,0.2)'
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Box
          component="img"
          src="/images/vision.png"
          alt="Vision"
          sx={{
            width: '100%',
            height: 'auto',
            borderRadius: 4,
            boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
            border: '3px solid white',
            transform: 'translateZ(0)'
          }}
        />
      </motion.div>
    </Grid>

    <Grid item xs={12} md={7}>
      <Box sx={{
        p: { xs: 3, md: 4 },
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 3,
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(4,93,159,0.1)',
        boxShadow: '0 8px 24px rgba(4,93,159,0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 32px rgba(4,93,159,0.15)'
        }
      }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ 
                mb: 2,
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
              <Typography variant="body1" sx={{ 
                color: '#4A4A4A',
                lineHeight: 1.8,
                fontSize: '1.1rem',
                pl: 1.5
              }}>
                Our mission is to simplify data visualization by using AI to automatically understand user 
                intent and generate the most suitable charts. We strive to make data insights more accessible, 
                accurate, and engaging for users of all backgrounds.
              </Typography>
            </Box>

            <Divider sx={{ 
              my: 4, 
              borderColor: '#D6E6F2',
              '&:before, &:after': { 
                borderTopWidth: 2,
                background: 'linear-gradient(90deg, transparent 0%, #00B4DB 50%, transparent 100%)'
              }
            }} />
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h3" sx={{ 
                mb: 2,
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
                Vision
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#4A4A4A',
                lineHeight: 1.8,
                fontSize: '1.1rem',
                pl: 1.5
              }}>
                To become a leading AI-powered platform that bridges the gap between complex data and meaningful 
                visualizations. We envision a future where everyone can interact with data intuitively and make 
                smarter decisions, powered by intelligent chart recommendations.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  </Grid>
</Box>

      <Footer />
    </Box>
  );
};

export default AboutUs;