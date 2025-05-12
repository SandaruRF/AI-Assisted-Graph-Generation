import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSubmit } from "../services/api.js";
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

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const Navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = (e) => {
    handleSubmit(e, Navigate, setError, email, password);
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
          bgcolor: "#e3f2fd", // Light blue background matching the image
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 4, color: "#0277bd", fontWeight: "bold" }}
        >
          Log in
        </Typography>
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          <Typography sx={{ mb: 1, color: "#0277bd" }}>Email</Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            sx={{
              mb: 2,
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              mb: 2,
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

          {error && <Typography color="error">{error}</Typography>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              p: 1.5,
              bgcolor: "#90caf9",
              color: "#0277bd",
              borderRadius: 10,
              "&:hover": {
                bgcolor: "#64b5f6",
              },
            }}
          >
            Log in
          </Button>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Link
              href="/forgot-password/"
              variant="body2"
              sx={{ color: "#0277bd" }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Typography variant="body2" sx={{ color: "#0277bd" }}>
              Don't have an account?
              <Link href="/signup" sx={{ ml: 1, color: "#0277bd" }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
