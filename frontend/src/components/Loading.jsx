import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Loading = () => {
    return (
    <Box
        sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        }}
    >
        <CircularProgress size={60} color="primary" />
    </Box>
    );
};

export default Loading;
