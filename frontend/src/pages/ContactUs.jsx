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

     {/* Content Section */}
<Box sx={{ 
  maxWidth: 1200, 
  mx: 'auto', 
  px: { xs: 3, md: 6 }, 
  mt: 8, 
  mb: 12,
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: { xs: 'column', md: 'row' },  // Stack on small screens and row on larger
  gap: 6,  // Add space between left and right columns
}}>
  {/* Left Column - Contact Info */}
  <Box sx={{ 
    flex: 1, 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    pr: { md: 4 }
  }}>
    {/* "Get in Touch" Header */}
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

    {/* Description Text */}
    <Typography variant="body1" sx={{
      color: '#4A4A4A',
      fontSize: '1.1rem',
      lineHeight: 1.8
    }}>
      Have a question, feedback, or collaboration idea? We'd love to hear from you.
    </Typography>
  </Box>

  {/* Right Column - Contact Form */}
 <Box sx={{ 
  flex: 1, 
  background: '#ffffff', 
  p: 4, 
  borderRadius: 3, 
  boxShadow: '0 8px 32px rgba(4,93,159,0.1)', 
  border: '1px solid #e0e0e0' 
}}>
  {/* Form Title */}
  <Typography variant="h5" sx={{ 
    mb: 4,  // Increased margin bottom
    fontWeight: 700, 
    color: '#045D9F', 
    borderLeft: '4px solid #00B4DB', 
    pl: 2, 
    fontSize: '1.8rem' 
  }}>
    Contact Form
  </Typography>

  {/* Form Fields */}
  <Grid container spacing={3}>
    {/* Name Row */}
    <Grid container item spacing={3}>
     <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: 250 } }}>
        <TextField
          fullWidth
          label="First Name"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': { borderColor: '#00B4DB' },
              '&.Mui-focused fieldset': { 
                borderColor: '#045D9F',
                borderWidth: '2px'
              }
            }
          }}
        />
      </Grid>
     <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: 250 } }}>
        <TextField
          fullWidth
          label="Last Name"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': { borderColor: '#00B4DB' },
              '&.Mui-focused fieldset': { 
                borderColor: '#045D9F',
                borderWidth: '2px'
              }
            }
          }}
        />
      </Grid>
    </Grid>

    {/* Contact Info Row */}
<Grid container item spacing={3} justifyContent="space-between">
  <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: 250 } }}>
    <TextField
      fullWidth
      label="Email"
      type="email"
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
        }
      }}
    />
  </Grid>
  <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: 250 } }}>
    <TextField
      fullWidth
      label="Phone No"
      type="tel"
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
        }
      }}
    />
  </Grid>
</Grid>



    {/* Subject Field */}
    <Grid item xs={12} sx={{
      width: '100%',         // make the Grid cell itself full-width
      mt: 0.6               // space above the button
    }}>
      <TextField
        fullWidth
        label="Subject"
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          }
        }}
      />
    </Grid>

  {/* Submit Button */}
 
  <Grid
    item
    xs={12}
    sx={{
      width: '100%',         // make the Grid cell itself full-width
      mt: 1                 // space above the button
    }}
  >
    <Button
      fullWidth              // makes the <Button> stretch to its parent width
      variant="contained"
      size="large"
      sx={{
        py: 2,
        borderRadius: '8px',
        background: 'linear-gradient(45deg, #045D9F 30%, #00B4DB 90%)',
        fontWeight: 700,
        fontSize: '1.1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        transition: '0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 16px rgba(4,93,159,0.3)'
        }
      }}
    >
      SUBMIT
    </Button>
  </Grid>




  </Grid>
</Box>

</Box>






      <Footer />
    </Box>
  );
};

export default ContactUs;
