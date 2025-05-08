import { useState } from 'react';
import {handleSignUpP2} from '../services/api';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  ThemeProvider,
  createTheme,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0069FF',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

const NameEnterPage = (e) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");

  const Navigate = useNavigate();
  
  const steps = ['Personal Information', 'Contact Number', 'Finish'];
  
  const handleNext = () => {
    // In a real app, this would make an API call to the FastAPI backend
    // fetch('/api/user/create', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ firstName, lastName })
    // })
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleSignup = (event) => handleSignUpP2(event, firstName, lastName, phoneNumber,Navigate,setError);
  
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              background: 'linear-gradient(to right, #ffffff, #f8f8f8)' 
            }}
          >
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome to VizGen
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                {activeStep + 1} of {steps.length}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Let's get started.
              </Typography>
            </Box>
            
            <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {activeStep === 0 && (
              <Box>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  When you join VizGen, we'll create a Private Workspace for you, which you can use for your own personal projects. You'll also be able to chat with your database.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={firstName}
                    placeholder='Jack'
                    onChange={(e) => setFirstName(e.target.value)}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={lastName}
                    placeholder='Sparrow'
                    onChange={(e) => setLastName(e.target.value)}
                    variant="outlined"
                  />
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleNext}
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
                  Next
                </Button>
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Verify Your Contact Number
                </Typography>
                
                <Box sx={{  gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    id='phone_number'
                    name='phone_number'
                    type='tel'
                    value={phoneNumber}
                    placeholder='0712345678'
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    variant="outlined"
                  />
                  
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleNext}
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
                  Next
                </Button>
              </Box>
            )}


{activeStep === 2 && (
              <Box>

                {error && <Typography color="error">{error}</Typography>}
                
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSignup}
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
                  Submit
                </Button>
              </Box>
            )}
            
            
            
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default NameEnterPage;