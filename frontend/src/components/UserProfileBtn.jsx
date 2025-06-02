import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from "@mui/material";

const UserProfileBtn = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

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
              src="https://i.pravatar.cc/300"
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
            <MenuItem onClick={() => alert("Settings Clicked")}>Settings</MenuItem>
            <MenuItem onClick={() => alert("Logout Clicked")}>Logout</MenuItem>
          </Menu>
        </Box>
    )}

    export default UserProfileBtn;