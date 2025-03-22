import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

const EditDatabaseConnection = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const connections = useMemo(() => [
    {
      id: 1,
      name: "eCommerce Database",
      host: "localhost",
      port: "1433",
      databaseName: "PostgreSQL",
      username: "Sandaru",
      
    },
    {
      id: 2,
      name: "EagleCart Database",
      host: "localhost",
      port: "1433",
      databaseName: "SQLite",
      username: "Sandaru",
      
    },
    {
      id: 3,
      name: "eCommerce Database",
      host: "localhost",
      port: "1433",
      databaseName: "ComShopDB",
      username: "Sandaru",
      
    },
  ], []);

  const [connectionDetails, setConnectionDetails] = useState({
    name: "",
    host: "",
    port: "",
    databaseName: "",
    username: "",
    // Removed password from state
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const connection = connections.find((conn) => conn.id === parseInt(id));
    if (connection) {
      // Destructure password out of the connection object
      const { password, ...connectionWithoutPassword } = connection;
      setConnectionDetails(connectionWithoutPassword);
    } else {
      setError("Connection not found.");
    }
  }, [id, connections]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConnectionDetails({
      ...connectionDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSuccess("Updating connection...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Connection updated successfully!");
      navigate("/existing-connections");
    } catch (err) {
      setError("Failed to update connection. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 4 }}>
      <Typography variant="h4" fontWeight="600" mb={3}>
        Edit Database Connections
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={connectionDetails.name}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Host"
          name="host"
          value={connectionDetails.host}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Port"
          name="port"
          value={connectionDetails.port}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Database Name"
          name="databaseName"
          value={connectionDetails.databaseName}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={connectionDetails.username}
          onChange={handleInputChange}
          margin="normal"
          required
        />

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
          <Button
            variant="outlined"
            color="primary.light"
            onClick={() => navigate("/existing-connections")}
          >
            Cancel
          </Button>
          
        </Box>
      </form>

      {/* Success and Error Messages */}
      {success && (
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setSuccess("")}>
          <Alert severity="success" sx={{ width: "100%" }}>
            {success}
          </Alert>
        </Snackbar>
      )}

      {error && (
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setError("")}>
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default EditDatabaseConnection;