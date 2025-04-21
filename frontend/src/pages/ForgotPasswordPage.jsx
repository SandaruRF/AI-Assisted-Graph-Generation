import React, { useState } from 'react';
import axios from 'axios';
import {
    Box, TextField, Button, Typography, Container, Paper
} from '@mui/material';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const sendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const res = await axios.post('http://localhost:8000/api/auth/send-otp', { email });
            console.log("OTP sent response:", res.data);
            if (res.data.phone) {
                setPhone(res.data.phone);
                setMessage('OTP sent to your registered phone number.');
                setStep(2);
            } else {
                throw new Error('Phone number not returned by backend');
            }
        } catch (err) {
            const detail = err.response?.data?.detail;
            setError(typeof detail === 'object' ? JSON.stringify(detail) : detail || 'Failed to send OTP. Please try again.');
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!phone) {
            setError('Phone number is missing. Please try sending OTP again.');
            return;
        }

        try {
            const res = await axios.post('http://localhost:8000/api/auth/verify-otp', { phone, otp });
            console.log("OTP verified response:", res.data);
            setMessage('OTP verified. You can now reset your password.');
            setStep(3);
        } catch (err) {
            const detail = err.response?.data?.detail;
            setError(typeof detail === 'object' ? JSON.stringify(detail) : detail || 'Invalid OTP. Please try again.');
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
            const res = await axios.post('http://localhost:8000/api/auth/reset-password', {
                phone,
                new_password: newPassword,
            });
            console.log("Password reset response:", res.data);
            setMessage('Password reset successful! You can now log in.');
            setStep(1);
            setEmail('');
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');
            setPhone('');
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
