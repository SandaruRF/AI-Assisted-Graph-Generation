import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from "@mui/material";
import { fetchUserProfile } from "../services/api";

const UserProfileBtn = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    fetchUserProfile(
      (data) => setProfilePhoto(data.user_profile_picture || null),
      () => {}
    );
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton onClick={handleClick} size="small">
        <Avatar
          alt="User"
          src={profilePhoto}
          sx={{ width: 40, height: 40 }}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => navigate("/user-profile")}>Profile</MenuItem>
        <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
        <MenuItem onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}>Logout</MenuItem>
      </Menu>
    </Box>
  )
}

export default UserProfileBtn;