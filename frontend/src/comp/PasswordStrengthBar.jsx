// PasswordStrengthBar.js
import React from 'react';
import zxcvbn from 'zxcvbn';
import { LinearProgress, Typography } from '@mui/material';

const PasswordStrengthBar = ({ password }) => {
    const strength = zxcvbn(password);
    const score = strength.score;  // Password strength score (0-4)
    const strengthText = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][score];
    const color = [
    'error', // Weak
    'warning', // Fair
    'info', // Good
    'success', // Strong
    'success' // Very Strong
    ][score];

    return (
    <div>
        <LinearProgress
        variant="determinate"
        value={(score + 1) * 25}  // Password strength (0-100%)
        color={color}
        sx={{ borderRadius: 5, marginTop: 1 }}
        />
        <Typography variant="body2" color={color} sx={{ marginTop: 1 }}>
        {strengthText}
        </Typography>
    </div>
    );
};

export default PasswordStrengthBar;
