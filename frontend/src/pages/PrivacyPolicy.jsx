// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';


const PrivacyPolicy = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8F9FD' }}>
      <NavigationBar />

      {/* Main Content */}
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        p: { xs: 3, md: 6 },
        mt: 8
      }}>
        <Box sx={{ 
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(4,93,159,0.08)',
          p: { xs: 3, md: 6 }
        }}>
          {/* Main Heading */}
          <Typography variant="h2" sx={{
            mb: 4,
            fontWeight: 800,
            background: '#045D9F',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}>
            Privacy Policy
          </Typography>

          {/* Introduction */}
          <Typography variant="body1" sx={{ 
            mb: 6, 
            fontSize: '1.1rem',
            lineHeight: 1.8,
            textAlign: 'center'
          }}>
            Your privacy matters to us. This Privacy Policy outlines how we collect, use, and protect the
            information you provide while using our AI-powered chart assistant.
          </Typography>

          {/* Information We Collect */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ 
              mb: 4,
              fontWeight: 700,
              color: '#045D9F',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '-6px',
                left: 0,
                width: '40px',
                height: '2px',
                background: '#00B4DB'
              }
            }}>
              Information We Collect
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, color: '#045D9F' }}>
                  User Input Data
                </Typography>
                <Typography variant="body1">
                  Temporary collection of chart preferences and prompts to generate visualizations
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, color: '#045D9F' }}>
                  Usage Data
                </Typography>
                <Typography variant="body1">
                  Browser type, device information, and interaction patterns for service improvement
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* How We Use Your Information */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ 
              mb: 4,
              fontWeight: 700,
              color: '#045D9F',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '-6px',
                left: 0,
                width: '40px',
                height: '2px',
                background: '#00B4DB'
              }
            }}>
              How We Use Your Information
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, color: '#045D9F' }}>
                  Chart Generation
                </Typography>
                <Typography variant="body1">
                  Transform inputs into visual representations using AI algorithms
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, color: '#045D9F' }}>
                  Service Improvement
                </Typography>
                <Typography variant="body1">
                  Enhance user experience based on interaction patterns
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, color: '#045D9F' }}>
                  AI Training
                </Typography>
                <Typography variant="body1">
                  Improve chart recommendation accuracy with anonymized data
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Data Management Section */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ 
                mb: 2,
                fontWeight: 700,
                color: '#045D9F',
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-6px',
                  left: 0,
                  width: '40px',
                  height: '2px',
                  background: '#00B4DB'
                }
              }}>
                Data Retention
              </Typography>
              <Typography variant="body1">
                User data retained temporarily, AI inputs not stored permanently
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ 
                mb: 2,
                fontWeight: 700,
                color: '#045D9F',
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-6px',
                  left: 0,
                  width: '40px',
                  height: '2px',
                  background: '#00B4DB'
                }
              }}>
                Data Sharing
              </Typography>
              <Typography variant="body1">
                No personal data sold or shared with third parties
              </Typography>
            </Grid>
          </Grid>

          {/* Security & Rights Section */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ 
                mb: 2,
                fontWeight: 700,
                color: '#045D9F',
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-6px',
                  left: 0,
                  width: '40px',
                  height: '2px',
                  background: '#00B4DB'
                }
              }}>
                Security
              </Typography>
              <Typography variant="body1">
                Technical safeguards implemented with 100% security disclaimer
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ 
                mb: 2,
                fontWeight: 700,
                color: '#045D9F',
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-6px',
                  left: 0,
                  width: '40px',
                  height: '2px',
                  background: '#00B4DB'
                }
              }}>
                Your Rights
              </Typography>
              <Box component="ul" sx={{ pl: 0, listStyleType: 'none' }}>
                {['Request data deletion', 'Contact privacy concerns'].map((item, idx) => (
                  <Box component="li" key={idx} sx={{ 
                    mb: 1, 
                    pl: 2,
                    position: 'relative'
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      left: 0,
                      top: '0.4em',
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#00B4DB',
                      borderRadius: '50%'
                    }} />
                    <Typography variant="body1">{item}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default PrivacyPolicy;