import React, {useState} from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Divider,
  CssBaseline,
  GlobalStyles
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useNavigate } from 'react-router-dom';

import {handleSubmit} from "../services/api.js";


// Create a styled component for the logo
const Logo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& img': {
    height: 36,
  },
}));

// Custom styled button for SSO providers
const SSOButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  color: '#333',
  justifyContent: 'flex-start',
  textAlign: 'left',
  border: '1px solid rgba(0,0,0,0.15)',
  borderRadius: '4px',
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.03)',
    border: '1px solid rgba(0,0,0,0.25)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(2),
  },
}));

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Navigation function
const Navigate = useNavigate();
const handleNavigation = (path) => Navigate(path);


const handleFormSubmit = (e) => {
    handleSubmit(e, Navigate, setError, email, password);
  };





  return (
    <>
      <CssBaseline />
      <GlobalStyles 
        styles={{
          'html, body': { margin: 0, padding: 0 },
          body: { backgroundColor: '#fff', overflow: 'hidden' }
        }} 
      />
      <Container 
        maxWidth={false} 
        disableGutters 
        sx={{ 
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          bgcolor: '#fff', // Light background
          m: 0,
          p: 0,
        }}
      >
      <Grid container sx={{ height: '100%' }}>
        {/* Left side with background image */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{ 
            position: 'relative',
            backgroundImage: 'url(/images/login-image.png), linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)', // Replace with your image path
            
            display: { xs: 'none', md: 'flex' }, // Hide on mobile
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 4,
            backgroundColor: '#f5f7fa',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(8px)', // Apply blur
              WebkitBackdropFilter: 'blur(8px)', // Safari support
              zIndex: 1,
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Logo>
              <Typography variant="h2" component="div" sx={{ display: 'flex', alignItems: 'center', color: '#333', fontWeight: 'bold' }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <img 
              src="/images/logo.png" 
              alt="VizGen Logo" 
              style={{ height: 100, cursor: "pointer" }}
              onClick={() => handleNavigation("/")}
            />
            
          </Box>
              
              </Typography>
            </Logo>
            
            <Box sx={{ mt: 8 }}>
              <Typography variant="h3" component="h1" color="#333" fontWeight="bold" gutterBottom>
                Sign in
              </Typography>
              <Typography variant="body1" color="#555" paragraph sx={{ maxWidth: 400, mx: 'auto' }}>
              Welcome to the future of data storytelling—where AI transforms your data into stunning, smart visuals in seconds.
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => handleNavigation("/sign-up")}
                sx={{ 
                  borderColor: 'rgba(0,0,0,0.2)', 
                  color: '#333', 
                  mt: 2,
                  '&:hover': {
                    borderColor: 'rgba(0,0,0,0.5)',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                  }
                }}
              >
                Sign up for a free account
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Right side with login form */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            bgcolor: '#ffffff', // White background
          }}
        >
          {/* Mobile logo - only shown on small screens */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4, width: '100%' }}>
            <Logo>
              <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', color: '#333', fontWeight: 'bold' }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <img 
              src="/images/logo.png" 
              alt="VizGen Logo" 
              style={{ height: 100, cursor: "pointer" }}
              onClick={() => handleNavigation("/")}
            />
            
          </Box>
              </Typography>
            </Logo>
            
            <Typography variant="h4" component="h1" color="#333" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
              Sign in
            </Typography>
            <Typography variant="body2" color="#555" paragraph>
            Welcome to the future of data storytelling—where AI transforms your data into stunning, smart visuals in seconds.
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 400, width: '100%' }}>
            {/* SSO Login Options */}
            
            <SSOButton 
              variant="outlined"
              startIcon={<GoogleIcon />}
              endIcon={<Box component="span" sx={{ ml: 'auto' }}>›</Box>}
            >
              Log in with Google
            </SSOButton>


            <SSOButton 
              variant="outlined"
              startIcon={<GitHubIcon />}
              endIcon={<Box component="span" sx={{ ml: 'auto' }}>›</Box>}
            >
              Log in with GitHub
            </SSOButton>

            <SSOButton 
              variant="outlined"
              startIcon={<FacebookIcon />}
              endIcon={<Box component="span" sx={{ ml: 'auto' }}>›</Box>}
            >
              Log in with Facebook
            </SSOButton>
            
          

            <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
              <Divider sx={{ flexGrow: 1, bgcolor: 'rgba(0,0,0,0.1)' }} />
            </Box>

            {/* Traditional Login Form */}
            <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleFormSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                placeholder="JackSparrow@gmail.com"
                variant="outlined"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0,0,0,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0,0,0,0.4)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0,0,0,0.7)',
                  },
                  '& .MuiInputBase-input': {
                    color: '#333',
                  },
                shrink: true,
                }}
                
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                placeholder="••••••••••"
                variant="outlined"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0,0,0,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0,0,0,0.4)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0,0,0,0.7)',
                  },
                  '& .MuiInputBase-input': {
                    color: '#333',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: 'rgba(0,0,0,0.5)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  shrink: true,
                }}
                
              />
              {error && <Typography color="error">{error}</Typography>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
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
                LOG IN
              </Button>
              <Box sx={{ textAlign: 'right' }}>
                <Link href="/forgot-password/" variant="body2" sx={{ color: '#0069FF' }}>
                  Forgot your password?
                </Link>
              </Box>
            </Box>
          </Box>

          {/* Mobile sign up link - only shown on small screens */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="#555" sx={{ display: 'inline-block', mr: 1 }}>
              Don't have an account?
            </Typography>
            <Link href="/sign-up" variant="body2" sx={{ color: '#0069FF' }}>
              Sign up for free
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Container>
    </>
  );
};

export default LoginPage;