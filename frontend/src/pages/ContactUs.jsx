// src/pages/ContactUs.jsx
import React from 'react';
import { Box, Typography, Grid, TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';

const ContactUs = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8F9FD' }}>
      <NavigationBar />

      {/* Hero Section */}
<Box sx={{
  position: 'relative',
  height: '500px',
  overflow: 'hidden',
  mb: 8,
  backgroundColor: '#03224C',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(3, 34, 76, 0.8), rgba(3, 34, 76, 0.5))',
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
      filter: 'brightness(0.9) contrast(1.1)',
      opacity: 0.4
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
        fontWeight: 900,
        color: 'white',
        fontSize: { xs: '2.75rem', md: '4rem' },
        maxWidth: '800px',
        mx: 'auto',
        letterSpacing: '0.05em',
        p: 4,
        textShadow: '0 4px 8px rgba(0,0,0,0.3)',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '30%',
          height: '4px',
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, #FFFFFF 50%, rgba(255,255,255,0) 100%)',
          animation: 'underlineExpand 0.8s ease-out forwards',
          '@keyframes underlineExpand': {
            '0%': { width: '0%' },
            '100%': { width: '30%' }
          }
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Contact Us
      </motion.div>
    </Typography>
  </Box>
</Box>

      {/* Content */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 3, md: 6 }, mt: 8, mb: 12 }}>
        <Grid container spacing={6}>
          {/* Left Side */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h3" sx={{
                mb: 3,
                fontWeight: 800,
                color: '#033E6B',
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-12px',
                  left: 0,
                  width: '80px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #00B4DB, #045D9F)',
                  borderRadius: 2
                }
              }}>
                Get in Touch
              </Typography>
              <Typography variant="body1" sx={{
                mb: 4,
                color: '#4A4A4A',
                fontSize: '1.1rem',
                lineHeight: 1.8
              }}>
                Have a question, feedback, or collaboration idea? We'd love to hear from you.
              </Typography>
            </motion.div>
          </Grid>

          {/* Right Side - Form */}
       {/* Right Section - Contact Form */}
<Grid item xs={12} md={7} sx={{ 
  order: { xs: 1, md: 2 },
  pl: { md: 4 },
  display: 'flex',
  flexDirection: 'column'
}}>
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    {/* Outer Heading */}
    

    {/* Contact Form Box */}
    <Box component="form" sx={{ 
      background: 'linear-gradient(to right, #ffffff, #f0f4f8)',
      p: { xs: 3, md: 4 },
      borderRadius: 3,
      boxShadow: '0 12px 32px rgba(4,93,159,0.1)',
      border: '1px solid #e0e0e0',
      backdropFilter: 'blur(4px)',
      transition: 'all 0.3s ease-in-out'
    }}>
      
      {/* Heading inside the form box */}
      <Typography 
      variant="h5" 
      sx={{ 
        mb: 2,
        fontWeight: 700,
        color: '#045D9F',
        alignSelf: 'flex-start',
        pl: 1,
        borderLeft: '4px solid #00B4DB',
        paddingLeft: '12px',
        fontSize: '1.8rem'
      }}
    >
      Contact Form
    </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            sx={{ 
              backgroundColor: '#fff',
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#00B4DB',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#045D9F',
                }
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            sx={{ 
              backgroundColor: '#fff',
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#00B4DB',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#045D9F',
                }
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            sx={{ 
              backgroundColor: '#fff',
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#00B4DB',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#045D9F',
                }
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone No"
            type="tel"
            variant="outlined"
            sx={{ 
              backgroundColor: '#fff',
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#00B4DB',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#045D9F',
                }
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Subject"
            variant="outlined"
            sx={{ 
              backgroundColor: '#fff',
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#00B4DB',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#045D9F',
                }
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              background: 'linear-gradient(45deg, #045D9F 30%, #00B4DB 90%)',
              fontWeight: 700,
              fontSize: '1.1rem',
              transition: '0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(4,93,159,0.3)'
              }
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  </motion.div>
</Grid>

        </Grid>
      </Box>

      <Footer />
    </Box>
  );
};

export default ContactUs;
