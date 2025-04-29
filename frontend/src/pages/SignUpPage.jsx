import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PasswordStrengthBar from "../Components/PasswordStrengthBar";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Paper,
  Link,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form data:", formData);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/signup",
        formData
      );
      if (response.status === 200) {
        console.log("Sign up successful", response.data);
        navigate("/");
      }
    } catch (err) {
      console.error("Error during sign-up:", err);
      setError("Sign-up failed. Please try again.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          bgcolor: "#e3f2fd",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 3, color: "#0277bd", fontWeight: "bold" }}
        >
          Sign Up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          <Typography sx={{ mb: 1, color: "#0277bd" }}>First name</Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="first_name"
            name="first_name"
            autoComplete="given-name"
            autoFocus
            value={formData.first_name}
            onChange={handleChange}
            variant="outlined"
            sx={{
              mb: 2,
              mt: 0,
              "& .MuiOutlinedInput-root": {
                bgcolor: "white",
                borderRadius: 1,
              },
            }}
          />

          <Typography sx={{ mb: 1, color: "#0277bd" }}>Last name</Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="last_name"
            name="last_name"
            autoComplete="family-name"
            value={formData.last_name}
            onChange={handleChange}
            variant="outlined"
            sx={{
              mb: 2,
              mt: 0,
              "& .MuiOutlinedInput-root": {
                bgcolor: "white",
                borderRadius: 1,
              },
            }}
          />

          <Typography sx={{ mb: 1, color: "#0277bd" }}>Email</Typography>
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
              "& .MuiOutlinedInput-root": {
                bgcolor: "white",
                borderRadius: 1,
              },
            }}
          />

          <Typography sx={{ mb: 1, color: "#0277bd" }}>
            Contact number
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="phone_number"
            name="phone_number"
            autoComplete="tel"
            value={formData.phone_number}
            onChange={handleChange}
            variant="outlined"
            sx={{
              mb: 2,
              mt: 0,
              "& .MuiOutlinedInput-root": {
                bgcolor: "white",
                borderRadius: 1,
              },
            }}
          />

          <Typography sx={{ mb: 1, color: "#0277bd" }}>Password</Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            sx={{
              mb: 2,
              mt: 0,
              "& .MuiOutlinedInput-root": {
                bgcolor: "white",
                borderRadius: 1,
              },
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

          <Typography sx={{ mb: 1, color: "#0277bd" }}>
            Confirm password
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirm_password"
            type={showConfirmPassword ? "text" : "password"}
            id="confirm_password"
            autoComplete="new-password"
            value={formData.confirm_password}
            onChange={handleChange}
            sx={{
              mb: 2,
              mt: 0,
              "& .MuiOutlinedInput-root": {
                bgcolor: "white",
                borderRadius: 1,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <PasswordStrengthBar password={formData.password} />

          {error && <Typography color="error">{error}</Typography>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              p: 1.5,
              bgcolor: "#90caf9",
              color: "#0277bd",
              borderRadius: 10,
              " &:hover": {
                bgcolor: "#64b5f6",
              },
            }}
          >
            Sign Up
          </Button>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Typography variant="body2" sx={{ color: "#0277bd" }}>
              Already have an account?
              <Link href="/" sx={{ ml: 1, color: "#0277bd" }}>
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
