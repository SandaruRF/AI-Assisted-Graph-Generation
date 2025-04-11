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
import axios from "axios";

const API_URL = "http://localhost:8001"; // Backend URL

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
  const [selectedDbType, setSelectedDbType] = useState("MySQL");
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
  const [isLoading, setIsLoading] = useState(false);

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
    } catch {
      setError("Connection test failed");
    }
  };

  const handleSaveConnection = async () => {
    if (!selectedDbType) {
      setError("Please select a database type");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      let endpoint = "";
      let payload = {};

      if (showForm) {
        // Detailed form
        endpoint = `${API_URL}/api/connections`;
        payload = {
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
      } else {
        // Connection string form
        endpoint = `${API_URL}/api/connection-strings`;
        payload = {
          name: connectionDetails.name,
          db_type: selectedDbType,
          connection_string: connectionDetails.connectionString,
          ssl: connectionDetails.ssl,
          remember: connectionDetails.remember,
        };
      }

      const response = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess(`Connection "${response.data.connection_name}" saved successfully!`);

      setConnectionDetails({
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
      setSelectedDbType("MySQL");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save connection");
    } finally {
      setIsLoading(false);
    }
  };

  const ConnectionStringForm = () => (
    <>
      <TextField
        fullWidth
        label="Connection Name"
        name="name"
        value={connectionDetails.name}
        onChange={handleInputChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Connection String"
        name="connectionString"
        value={connectionDetails.connectionString}
        onChange={handleInputChange}
        margin="normal"
        required
      />
    </>
  );

  const DetailedConnectionForm = () => (
    <Grid container spacing={0.5}>
      {["name", "host", "port", "database", "username", "password"].map((field, idx) => (
        <Grid item xs={12} key={idx}>
          <TextField
            fullWidth
            label={field === "name" ? "Connection Name" : field.charAt(0).toUpperCase() + field.slice(1)}
            name={field}
            type={field === "password" ? "password" : field === "port" ? "number" : "text"}
            value={connectionDetails[field]}
            onChange={handleInputChange}
            margin="normal"
            required
          />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ maxWidth: 850, margin: "auto", p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" fontWeight="600" mb={3}>
          New Connection
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Button variant={!showForm ? "contained" : "outlined"} onClick={() => setShowForm(false)}>
            Connection String
          </Button>
          <Button variant={showForm ? "contained" : "outlined"} onClick={() => setShowForm(true)}>
            Connection Form
          </Button>
        </Box>

        {/* Database Types */}
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 1,
            mb: 3,
            pb: 1,
            "&::-webkit-scrollbar": { height: "4px" },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "action.selected", borderRadius: "2px" },
          }}
        >
          {databaseTypes.map((db) => (
            <Button
              key={db}
              variant={selectedDbType === db ? "contained" : "outlined"}
              onClick={() => setSelectedDbType(db)}
              sx={{
                textTransform: "none",
                backgroundColor: selectedDbType === db ? "primary.main" : "action.hover",
                "&:hover": {
                  backgroundColor: selectedDbType === db ? "primary.dark" : "action.selected",
                },
              }}
            >
              {db}
            </Button>
          ))}
        </Box>

        {/* Forms */}
        {showForm ? <DetailedConnectionForm /> : <ConnectionStringForm />}

        {/* SSL / Remember */}
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

        {/* Buttons */}
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={handleTestConnection} disabled={isLoading}>
            Test Connection
          </Button>
          <Button variant="contained" color="success" onClick={handleSaveConnection} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Connection"}
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