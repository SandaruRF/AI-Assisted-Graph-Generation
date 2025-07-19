import React, { useState } from "react";
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
  Grid,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import MemoryIcon from "@mui/icons-material/Memory";
import { saveConnection } from "../services/api";
import { useNavigate } from "react-router-dom";

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
  const [useFormMode, setUseFormMode] = useState(false);
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
    db_type: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConnectionDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setConnectionDetails((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleTestConnection = async () => {
    showSnackbar("Testing connection...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock test
      showSnackbar("Connection test successful!", "success");
    } catch {
      showSnackbar("Connection test failed.", "error");
    }
  };

  const handleSaveConnection = async () => {
    const isConnectionStringMode = !useFormMode;
  
    if (!selectedDbType) {
      showSnackbar("Please select a database type.", "error");
      return;
    }
  
    if (!connectionDetails.name || connectionDetails.name.trim() === "") {
      showSnackbar("Please enter a connection name.", "error");
      return;
    }
  
    if (isConnectionStringMode) {
      // Validate connection string
      if (!connectionDetails.connectionString || connectionDetails.connectionString.trim() === "") {
        showSnackbar("Please enter a connection string.", "error");
        return;
      }
    } else {
      // Validate individual form fields
      const requiredFields = [
        { key: "host", label: "Host" },
        { key: "port", label: "Port" },
        { key: "database", label: "Database" },
        { key: "username", label: "Username" },
        { key: "password", label: "Password" },
      ];
  
      for (const field of requiredFields) {
        const value = connectionDetails[field.key];
        if (!value || value.toString().trim() === "") {
          showSnackbar(`Please enter ${field.label}.`, "error");
          return;
        }
      }
    }
  
    const payload = isConnectionStringMode
      ? {
          name: connectionDetails.name,
          db_type: selectedDbType,
          connection_string: connectionDetails.connectionString,
          ssl: connectionDetails.ssl,
          remember: connectionDetails.remember,
        }
      : {
          name: connectionDetails.name,
          db_type: selectedDbType,
          host: connectionDetails.host,
          port: parseInt(connectionDetails.port || "0"),
          database: connectionDetails.database,
          username: connectionDetails.username,
          password: connectionDetails.password,
          ssl: connectionDetails.ssl,
          remember: connectionDetails.remember,
        };
  
    const endpoint = isConnectionStringMode
      ? "/api/connection-strings"
      : "/api/connections";
  
    showSnackbar("Saving connection...");
    try {
      await saveConnection(payload, endpoint);
      showSnackbar("Connection saved successfully!", "success");
      


      setTimeout(() => navigate("/existing-connections"), 1000);
    } catch (err) {
      showSnackbar(err.response?.data?.detail || "Failed to save connection.", "error");
    }
  };
  

  return (
    <Box sx={{ maxWidth: 850, margin: "auto", p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" fontWeight="600" mb={3}>
          New Connection
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mt: 1, mb: 2 }}>
          <Button
            variant={!useFormMode ? "contained" : "outlined"}
            onClick={() => setUseFormMode(false)}
          >
            Connection String
          </Button>
          <Button
            variant={useFormMode ? "contained" : "outlined"}
            onClick={() => setUseFormMode(true)}
          >
            Connection Form
          </Button>
        </Box>

        {/* DB Type Selection */}
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 1,
            mb: 3,
            pb: 1,
            "&::-webkit-scrollbar": { height: "4px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "action.selected",
              borderRadius: "2px",
            },
          }}
        >
          {databaseTypes.map((dbType) => (
            <Button
              key={dbType}
              variant="contained"
              color={selectedDbType === dbType ? "primary" : "inherit"}
              onClick={() => setSelectedDbType(dbType)}
              sx={{
                flexShrink: 0,
                textTransform: "none",
                fontWeight: 500,
                px: 2.5,
                py: 0.75,
                fontSize: "0.875rem",
                boxShadow: "none",
                backgroundColor:
                  selectedDbType === dbType ? "primary.main" : "action.hover",
                "&:hover": {
                  backgroundColor:
                    selectedDbType === dbType
                      ? "primary.dark"
                      : "action.selected",
                },
              }}
            >
              {dbType}
            </Button>
          ))}
        </Box>

        {/* Connection Fields */}
        {!useFormMode ? (
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
          <Grid container spacing={1}>
            {[
              ["name", "Connection Name"],
              ["host", "Host"],
              ["port", "Port", "number"],
              ["database", "Database"],
              ["username", "Username"],
              ["password", "Password", "password"],
            ].map(([name, label, type = "text"]) => (
              <Grid item xs={12} key={name}>
                <TextField
                  fullWidth
                  label={label}
                  name={name}
                  type={type}
                  value={connectionDetails[name]}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
            ))}
          </Grid>
        )}

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
          />
        </Box>

        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleTestConnection}>
            Test Connection
          </Button>
          <Button variant="contained" color="success" onClick={handleSaveConnection}>
            Save Connection
          </Button>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewConnection;
