import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, TextField, Button, Typography, Container, Paper
} from '@mui/material';
import emailjs from '@emailjs/browser';
import { useNavigate } from "react-router-dom";

const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_PRIVATEKEY;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATEID;
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLICKEY;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const sendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);

    const templateParams = {
      to_email: email,
      otp: otpCode,
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      setMessage('OTP sent to your email address.');
      setStep(2);
    } catch (err) {
      console.error('EmailJS error:', err);
      setError('Failed to send OTP via email. Please try again.');
    }
  };


  const verifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (otp === generatedOtp) {
      setMessage('OTP verified. You can now reset your password.');
      setStep(3);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

 
  const resetPassword = async (e) => {
    
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/reset-password`, {
        email,
        new_password: newPassword,
      });

      console.log("Password reset response:", res.data);
      setMessage('Password reset successful!\n You can now log in.');
      navigate('/login')
      setStep(1);

      // Clear all fields
      setEmail('');
      setOtp('');
      setGeneratedOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'object' ? JSON.stringify(detail) : detail || 'Failed to reset password.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 4 }}>
          Forgot Password
        </Typography>

        {message && <Typography color="primary" sx={{ mb: 2 }}>{message}</Typography>}
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        {step === 1 && (
          <Box component="form" onSubmit={sendOtp} noValidate sx={{ width: '100%' }}>
            <TextField
              label="Email"
              required
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Send OTP
            </Button>
          </Box>
        )}

        {step === 2 && (
          <Box component="form" onSubmit={verifyOtp} noValidate sx={{ width: '100%' }}>
            <TextField
              label="OTP"
              required
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Verify OTP
            </Button>
          </Box>
        )}

        {step === 3 && (
          <Box component="form" onSubmit={resetPassword} noValidate sx={{ width: '100%' }}>
            <TextField
              label="New Password"
              type="password"
              required
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Confirm Password"
              type="password"
              required
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Reset Password
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
