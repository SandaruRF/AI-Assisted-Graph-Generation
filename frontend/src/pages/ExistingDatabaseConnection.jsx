import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Chip,
  Stack,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

const ExistingDatabaseConnection = () => {
  const navigate = useNavigate();

  const [connections, setConnections] = useState([
    {
      id: 1,
      name: "eCommerce Database",
      host: "localhost",
      port: "1433",
      database: "ComShopDB",
      user: "Sandaru",
      type: "PostgreSQL"
    },
    {
      id: 2,
      name: "EagleCart Database",
      host: "localhost",
      port: "1433",
      database: "EagleCartDB",
      user: "Sandaru",
      type: "SQLite"
    },
    {
      id: 3,
      name: "eCommerce Database",
      host: "localhost",
      port: "1433",
      database: "ComShopDB",
      user: "Sandaru",
      type: "MySQL"
    }
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConnections = connections.filter(conn =>
    conn.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTestConnection = async (connection) => {
    try {
      setSuccess(`Testing connection to ${connection.name}...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(`Connection to ${connection.name} successful!`);
    } catch (err) {
      setError(`Failed to connect to ${connection.name}. Please check your details.`);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      {/* Header Section */}
      <Typography variant="h4" fontWeight="600" mb={3}>
        Connections
      </Typography>
      
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
        gap={2}
      >
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/new-connection")}
          sx={{ height: 40, minWidth: 200 }}
        >
          Create New Connection
        </Button>
        
        <TextField
          placeholder="Search..."
          variant="outlined"
          size="small"
          sx={{ width: 240 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Stack>

      {/* Connection Cards */}
      {filteredConnections.map((connection) => (
        <Paper 
          key={connection.id} 
          sx={{ 
            mb: 2, 
            p: 2.5,
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <Stack spacing={2}>
            {/* Top Row - Name and Type */}
            <Stack 
              direction="row" 
              justifyContent="space-between" 
              alignItems="center"
            >
              <Typography variant="subtitle1" fontWeight="600">
                {connection.name}
              </Typography>
              <Chip 
                label={connection.type} 
                size="small"
                sx={{ 
                  backgroundColor: 'action.hover',
                  color: 'text.primary',
                  fontWeight: 400,
                  ml: 2,
                  opacity: 0.8
                }}
              />
            </Stack>

            {/* Connection Details */}
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                flexWrap: 'wrap',
                gap: 1,
                '& .MuiChip-root': { 
                  borderRadius: 1,
                  backgroundColor: 'action.hover',
                  color: 'text.primary'
                }
              }}
            >
              <Chip label={`Host: ${connection.host}`} size="small" />
              <Chip label={`Port: ${connection.port}`} size="small" />
              <Chip label={`DB: ${connection.database}`} size="small" />
              <Chip label={`User: ${connection.user}`} size="small" />
            </Stack>

            {/* Bottom Action Row */}
            <Stack 
              direction="row" 
              spacing={1.5} 
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                variant="outlined"
                onClick={() => handleTestConnection(connection)}
                sx={{ 
                  whiteSpace: 'nowrap',
                  minWidth: 180,
                  height: 36,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'primary.light',
                    opacity: 0.9
                  }
                }}
              >
                Connect Database
              </Button>
              <Stack direction="row" spacing={1}>
                <IconButton 
                  onClick={() => navigate(`/edit-connection/${connection.id}`)}
                  sx={{ color: 'text.secondary' }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton 
                  onClick={() => setConnections(connections.filter(c => c.id !== connection.id))}
                  sx={{ color: 'error.main' }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      ))}

      {/* Notification Snackbars */}
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess("")}>
        <Alert severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExistingDatabaseConnection;