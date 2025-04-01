import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Container, 
    InputAdornment, 
    IconButton,
    Paper,
    Link
} from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value
        });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form data:', formData);
        // Add your registration logic here
    };

    // Navigate to login page
    

    return (
        <Container component="main" maxWidth="xs">
        <Paper
            elevation={3}
            sx={{
            mt: 8,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            bgcolor: '#e3f2fd', // Light blue background matching the image
            }}
        >
            <Typography component="h1" variant="h4" sx={{ mb: 3, color: '#0277bd', fontWeight: 'bold' }}>
            Sign Up
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <Typography sx={{ mb: 1, color: '#0277bd' }}>First name</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                autoFocus
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
                sx={{
                mb: 2,
                mt: 0,
                '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    borderRadius: 1,
                }
                }}
            />

            <Typography sx={{ mb: 1, color: '#0277bd' }}>Last name</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
                sx={{
                mb: 2,
                mt: 0,
                '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    borderRadius: 1,
                }
                }}
            />

            <Typography sx={{ mb: 1, color: '#0277bd' }}>Email</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                sx={{
                mb: 2,
                mt: 0,
                '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    borderRadius: 1,
                }
                }}
            />

            <Typography sx={{ mb: 1, color: '#0277bd' }}>Contact number</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="contactNumber"
                name="contactNumber"
                autoComplete="tel"
                value={formData.contactNumber}
                onChange={handleChange}
                variant="outlined"
                sx={{
                mb: 2,
                mt: 0,
                '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                borderRadius: 1,
                }
                }}
            />

            <Typography sx={{ mb: 1, color: '#0277bd' }}>Password</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                sx={{
                mb: 2,
                mt: 0,
                '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    borderRadius: 1,
                }
                }}
                InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                    >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                    </InputAdornment>
                ),
                }}
            />

            <Typography sx={{ mb: 1, color: '#0277bd' }}>Confirm password</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                sx={{
                mb: 2,
                mt: 0,
                '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    borderRadius: 1,
                }
            }}
                InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                    >
                        {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                    </InputAdornment>
                ),
                }}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                mt: 2,
                mb: 2,
                p: 1.5,
                bgcolor: '#90caf9',
                color: '#0277bd',
                borderRadius: 10,
              ' &:hover': {
                    bgcolor: '#64b5f6',
                },
            }}
            >
            Sign Up
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Typography variant="body2" sx={{ color: '#0277bd' }}>
                Already have an account? 
                <Link href="/log-in" sx={{ ml: 1, color: '#0277bd' }}>
                    Log in
                </Link>
                </Typography>
            </Box>
            </Box>
        </Paper>
    </Container>
    );
};

export default SignUpPage;