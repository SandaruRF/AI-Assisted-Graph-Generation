import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
  Paper,
  Grid
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import MemoryIcon from "@mui/icons-material/Memory";

const databaseTypes = [
  "MySQL",
  "PostgreSQL",
  "SQL Server",
  "MariaDB",
  "Oracle DB",
  "SQLite",
  "Redshift",
];

const NewConnection = () => {
  const navigate = useNavigate();
  const [selectedDbType, setSelectedDbType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState({
    name: "",
    connectionString: "",
    host: "",
    port: "",
    database: "",
    username: "",
    password: "",
    ssl: false,
    remember: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConnectionDetails({ ...connectionDetails, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setConnectionDetails({ ...connectionDetails, [name]: checked });
  };

  const handleTestConnection = async () => {
    setError("");
    setSuccess("Testing connection...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Connection test successful!");
    } catch (err) {
      setError("Connection test failed");
    }
  };

  const handleSaveConnection = () => {
    navigate("/existing-connections");
  };

  return (
    <Box sx={{ maxWidth: 850, margin: "auto", p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="600" mb={3}>
            Edit Database Connection
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Button
              variant={!showForm ? "contained" : "outlined"}
              onClick={() => setShowForm(false)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                fontSize: '0.875rem'
              }}
            >
              Connection String
            </Button>
            <Button
              variant={showForm ? "contained" : "outlined"}
              onClick={() => setShowForm(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                fontSize: '0.875rem'
              }}
            >
              Connection Form
            </Button>
          </Box>
        </Box>

        {/* Database Type Selection */}
        <Box sx={{ 
          display: "flex",
          flexWrap: "nowrap",
          overflowX: "auto",
          gap: 1, 
          mb: 3,
          pb: 1,
          "&::-webkit-scrollbar": {
            height: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "action.selected",
            borderRadius: "2px",
          }
        }}>
          {databaseTypes.map((dbType) => (
            <Button
              key={dbType}
              variant="contained"
              color={selectedDbType === dbType ? "primary" : "inherit"}
              onClick={() => setSelectedDbType(dbType)}
              sx={{
                flexShrink: 0,
                textTransform: 'none',
                fontWeight: 500,
                px: 2.5,
                py: 0.75,
                fontSize: '0.875rem',
                boxShadow: 'none',
                backgroundColor: selectedDbType === dbType 
                  ? 'primary.main' 
                  : 'action.hover',
                '&:hover': {
                  backgroundColor: selectedDbType === dbType 
                    ? 'primary.dark' 
                    : 'action.selected',
                  boxShadow: 'none'
                }
              }}
            >
              {dbType}
            </Button>
          ))}
        </Box>

        {/* Form Section */}
        {!showForm ? (
          <>
            <TextField
              fullWidth
              label="Connection Name"
              name="name"
              value={connectionDetails.name}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Connection String"
              name="connectionString"
              value={connectionDetails.connectionString}
              onChange={handleInputChange}
              margin="normal"
            />
          </>
        ) : (
          <Grid container spacing={0.5}> 
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Connection Name"
                name="name"
                value={connectionDetails.name}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Host"
                name="host"
                value={connectionDetails.host}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Port"
                name="port"
                type="number"
                value={connectionDetails.port}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Database Name"
                name="database"
                value={connectionDetails.database}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User name"
                name="username"
                value={connectionDetails.username}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={connectionDetails.password}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
          </Grid>
        )}

        {/* SSL & Remember Connection */}
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="ssl"
                checked={connectionDetails.ssl}
                onChange={handleCheckboxChange}
                icon={<LockIcon />}
                checkedIcon={<LockIcon />}
              />
            }
            label="Enable SSL/TLS"
            sx={{ display: "block" }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="remember"
                checked={connectionDetails.remember}
                onChange={handleCheckboxChange}
                icon={<MemoryIcon />}
                checkedIcon={<MemoryIcon />}
              />
            }
            label="Remember connection"
            sx={{ display: "block" }}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleTestConnection}
            sx={{
              flexShrink: 0,
              textTransform: 'none',
              fontWeight: 500,
              px: 2.5,
              py: 0.75,
              fontSize: '0.875rem',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                backgroundColor: 'primary.dark'
              }
            }}
          >
            Test Connection
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleSaveConnection}
            sx={{
              flexShrink: 0,
              textTransform: 'none',
              fontWeight: 500,
              px: 2.5,
              py: 0.75,
              fontSize: '0.875rem',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                backgroundColor: 'success.dark'
              }
            }}
          >
            Save Connection
          </Button>
        </Box>
      </Paper>

      {/* Notifications */}
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess("")}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default NewConnection;