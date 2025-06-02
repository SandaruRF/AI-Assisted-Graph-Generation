import React, { useState, useEffect } from 'react';
import NavigationBar from "../components/NavigationBar";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Grid,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
  Card,
  CardContent,
  Slide,
  Snackbar
} from '@mui/material';
import {
  PhotoCamera,
  Edit,
  Cancel,
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Lock,
  Update,
  CheckCircle
} from '@mui/icons-material';

import {fetchUserProfile} from '../services/api'; 
import { set } from 'mongoose';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserProfile = () => {
  const [profileData, setProfileData] = useState({
    firstName: 'Jack ',
    lastName: 'Sparrow',
    email: 'JackSparrow@blackpearl.com',
    mobile: '1234567890',
    profilePhoto: null
  });
  const [error, setError] = useState(""); 

  useEffect(() => {
    fetchUserProfile((data) => {
      setProfileData({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.email || '',
        mobile: data.phone_number || '',
        profilePhoto: data.user_profile_picture || null
      });
    }, setError);
  }, []);

  const [originalData, setOriginalData] = useState({ ...profileData });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...profileData });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar('File size must be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target.result;
        if (isEditing) {
          setEditData(prev => ({ ...prev, profilePhoto: photoUrl }));
        } else {
          setProfileData(prev => ({ ...prev, profilePhoto: photoUrl }));
          showSnackbar('Profile photo updated successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setOriginalData({ ...profileData });
    setEditData({ ...profileData });
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    // Validation
    if (!editData.firstName.trim() || !editData.lastName.trim() || 
        !editData.email.trim() || !editData.mobile.trim()) {
      showSnackbar('Please fill in all fields', 'error');
      return;
    }

    if (!isValidEmail(editData.email)) {
      showSnackbar('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProfileData({ ...editData });
      setIsEditing(false);
      showSnackbar('Profile updated successfully!', 'success');
    } catch (error) {
      showSnackbar('Failed to update profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...originalData });
    setIsEditing(false);
  };

  const handlePasswordSave = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showSnackbar('Please fill in all password fields', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showSnackbar('New passwords do not match!', 'error');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showSnackbar('Password must be at least 8 characters long!', 'error');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showSnackbar('Password changed successfully!', 'success');
    } catch (error) {
      showSnackbar('Failed to change password. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const currentData = isEditing ? editData : profileData;

  return (
        <Box sx={{ 
          backgroundColor: "#F8F9FD",
          minHeight: "100vh",
          overflow: "hidden"
        }}>
          <NavigationBar />
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Card */}
      <Card 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          mb: 3,
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Profile Details
            </Typography>
            {!isEditing && (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEdit}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                  borderRadius: 2
                }}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Main Profile Card */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* Profile Photo Section */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={currentData.profilePhoto}
              sx={{ 
                width: 120, 
                height: 120, 
                border: '4px solid #e3f2fd',
                boxShadow: 3
              }}
            >
              <Person sx={{ fontSize: 60 }} />
            </Avatar>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="photo-upload"
              type="file"
              onChange={handlePhotoUpload}
            />
            <label htmlFor="photo-upload">
              <IconButton
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: '#1976d2',
                  color: 'white',
                  '&:hover': { bgcolor: '#1565c0', transform: 'scale(1.1)' },
                  border: '3px solid white',
                  transition: 'all 0.3s ease'
                }}
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Profile Form */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="First Name"
              value={currentData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={!isEditing}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={currentData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={!isEditing}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={currentData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mobile Number"
              value={currentData.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              disabled={!isEditing}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          {isEditing ? (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Update />}
                onClick={handleUpdate}
                disabled={loading}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  minWidth: 140
                }}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={loading}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1.5
                }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Box />
          )}

          <Button
            variant="outlined"
            startIcon={<Lock />}
            onClick={() => setPasswordDialog(true)}
            sx={{ 
              borderRadius: 2,
              color: '#1976d2',
              borderColor: '#1976d2',
              px: 3,
              py: 1.5,
              '&:hover': {
                borderColor: '#1565c0',
                bgcolor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            Change Password
          </Button>
        </Box>
      </Paper>

      {/* Password Change Dialog */}
      <Dialog 
        open={passwordDialog} 
        onClose={() => setPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600,
          pb: 1,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Lock color="primary" />
            Change Password
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Current Password"
            type={showPasswords.current ? 'text' : 'password'}
            value={passwordData.currentPassword}
            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => togglePasswordVisibility('current')}>
                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="New Password"
            type={showPasswords.new ? 'text' : 'password'}
            value={passwordData.newPassword}
            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => togglePasswordVisibility('new')}>
                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            type={showPasswords.confirm ? 'text' : 'password'}
            value={passwordData.confirmPassword}
            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => togglePasswordVisibility('confirm')}>
                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={() => setPasswordDialog(false)}
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePasswordSave}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
    </Box>
  );
};

export default UserProfile;