import React, { useState, useEffect } from "react";
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
  InputAdornment,
  CircularProgress,
  Card,
  CardContent,
  Slide,
  Snackbar,
} from "@mui/material";
import {
  PhotoCamera,
  Edit,
  Cancel,
  Person,
  Email,
  Phone,
  Lock,
  Update,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";


import { fetchUserProfile, updateUserProfile } from "../services/api";


const UserProfile = () => {
  const theme = useTheme();
  const [profileData, setProfileData] = useState({
    firstName: "Jack ",
    lastName: "Sparrow",
    email: "JackSparrow@blackpearl.com",
    mobile: "1234567890",
    profilePhoto: null,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile((data) => {
      setProfileData({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        email: data.email || "",
        mobile: data.phone_number || "",
        profilePhoto: data.user_profile_picture || null,
      });
    }, setError);
  }, []);

  const [originalData, setOriginalData] = useState({ ...profileData });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...profileData });

 
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar("File size must be less than 5MB", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result; // This is already a base64 data URL
        if (isEditing) {
          setEditData((prev) => ({ ...prev, profilePhoto: base64String }));
        } else {
          setProfileData((prev) => ({ ...prev, profilePhoto: base64String }));
          showSnackbar("Profile photo updated successfully!", "success");
        }
      };
      reader.readAsDataURL(file); // This will convert the image to base64
    }
  };

  const handleEdit = () => {
    setOriginalData({ ...profileData });
    setEditData({ ...profileData });
    setIsEditing(true);
  };

  // Sync editData and originalData with profileData when it changes, but only if not editing
  useEffect(() => {
    if (!isEditing) {
      setEditData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        mobile: profileData.mobile || "",
        profilePhoto: profileData.profilePhoto || null,
      });
      setOriginalData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        mobile: profileData.mobile || "",
        profilePhoto: profileData.profilePhoto || null,
      });
    }
  }, [profileData, isEditing]);

  const handleUpdate = async () => {
    // Validation
    if (
      !(editData.firstName || "").trim() ||
      !(editData.lastName || "").trim() ||
      !(editData.email || "").trim() ||
      !(editData.mobile || "").trim()
    ) {
      showSnackbar("Please fill in all fields", "error");
      return;
    }

    if (!isValidEmail(editData.email || "")) {
      showSnackbar("Please enter a valid email address", "error");
      return;
    }

    setLoading(true);
    try {
      // Pass form data to API for update
      await updateUserProfile(editData, setProfileData, setError);
      setIsEditing(false);
      // Fetch latest profile data from backend after update
      fetchUserProfile((data) => {
        setProfileData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          mobile: data.phone_number || "",
          profilePhoto: data.user_profile_picture || null,
        });
      }, setError);
      showSnackbar("Profile updated successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to update profile. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...originalData });
    setIsEditing(false);
  };

 

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const currentData = isEditing ? editData : profileData;

  return (
    <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: "100vh",
          overflow: "hidden",
        }}
    >
      <NavigationBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header Card */}
        <Card
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            color: "white",
            mb: 3,
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                Profile Details
              </Typography>
              {!isEditing && (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                    borderRadius: 2,
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
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={currentData.profilePhoto}
                disabled={!isEditing}
                sx={{
                  width: 120,
                  height: 120,
                  border: "4px solid #e3f2fd",
                  boxShadow: 3,
                }}
              >
                <Person sx={{ fontSize: 60 }} />
              </Avatar>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="photo-upload"
                type="file"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photo-upload">
                <IconButton
                  component="span"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "#1976d2",
                    color: "white",
                    "&:hover": { bgcolor: "#1565c0", transform: "scale(1.1)" },
                    border: "3px solid white",
                    transition: "all 0.3s ease",
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
                onChange={(e) => handleInputChange("firstName", e.target.value)}
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
                onChange={(e) => handleInputChange("lastName", e.target.value)}
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
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={true}
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
                onChange={(e) => handleInputChange("mobile", e.target.value)}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {isEditing ? (
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Update />
                    )
                  }
                  onClick={handleUpdate}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    minWidth: 140,
                  }}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
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
              onClick={() => navigate("/forgot-password")}
              sx={{
                borderRadius: 2,
                color: "#1976d2",
                borderColor: "#1976d2",
                px: 3,
                py: 1.5,
                "&:hover": {
                  borderColor: "#1565c0",
                  bgcolor: "rgba(25, 118, 210, 0.04)",
                },
              }}
            >
              Change Password
            </Button>
          </Box>
        </Paper>

        

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
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
