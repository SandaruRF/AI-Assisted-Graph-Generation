import React, { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
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
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, FileDownload } from "@mui/icons-material";
import {
  fetchConnections,
  connectToDatabase,
  deleteConnection,
  handleExportClick,
} from "../services/api";
import NavigationBar from "../components/NavigationBar";

const ExistingDatabaseConnection = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [connectedSessions, setConnectedSessions] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchConnections(setConnections, setIsLoading, setError);
  }, []);

  const filteredConnections =
    connections?.filter((conn) =>
      conn?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
    ) || [];

  const handleConnectClick = async (connectionId) => {
    if (!connectionId) {
      setError("Connection ID is missing.");
      return;
    }

    try {
      const data = await connectToDatabase(connectionId);
      setSuccess(`Connected! sessionid: ${data.session_id}`);
      setConnectedSessions((prev) => ({
        ...prev,
        [connectionId]: data.session_id,
      }));
    } catch (err) {
      setError("Error Connecting: " + err.message);
    }
  };

  const handleDeleteClick = (connectionId) => {
    if (!connectionId) {
      setError("Connection ID is missing.");
      return;
    }

    deleteConnection(
      connectionId,
      connections,
      setConnections,
      setSuccess,
      setError
    );
    handleExportClick(data.sess);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F8F9FD",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <NavigationBar />

      <Box sx={{ maxWidth: 1200, margin: "auto", p: 3 }}>
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

        {isLoading ? (
          <Stack alignItems="center" mt={4}>
            <CircularProgress />
          </Stack>
        ) : (
          filteredConnections.map((connection) => (
            <Paper
              key={connection._id}
              sx={{
                mb: 2,
                p: 2.5,
                borderRadius: 2,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1" fontWeight="600">
                    {connection.name}
                  </Typography>
                  <Chip
                    label={connection.db_type}
                    size="small"
                    sx={{
                      backgroundColor: "action.hover",
                      color: "text.primary",
                      fontWeight: 400,
                      ml: 2,
                      opacity: 0.8,
                    }}
                  />
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    flexWrap: "wrap",
                    gap: 1,
                    "& .MuiChip-root": {
                      borderRadius: 1,
                      backgroundColor: "action.hover",
                      color: "text.primary",
                    },
                  }}
                >
                  {connection.host && (
                    <Chip label={`Host: ${connection.host}`} size="small" />
                  )}
                  {connection.port && (
                    <Chip label={`Port: ${connection.port}`} size="small" />
                  )}
                  {connection.database && (
                    <Chip label={`DB: ${connection.database}`} size="small" />
                  )}
                  {connection.username && (
                    <Chip label={`User: ${connection.username}`} size="small" />
                  )}
                </Stack>

                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Button
                    variant="outlined"
                    sx={{
                      minWidth: 180,
                      height: 36,
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        borderColor: "primary.dark",
                        backgroundColor: "primary.light",
                        opacity: 0.9,
                      },
                    }}
                    onClick={() => handleConnectClick(connection._id)}
                  >
                    Connect Database
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      minWidth: 120,
                      height: 36,
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        borderColor: "primary.dark",
                        backgroundColor: "primary.light",
                        opacity: 0.9,
                      },
                    }}
                    onClick={() => {
                      const sessionId = connectedSessions[connection._id];
                      if (!sessionId) {
                        setError("Please connect to the database first.");
                        return;
                      }
                      navigate("/graph-visualization", {
                        state: { sessionId },
                      });
                    }}
                  >
                    View Graph
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      minWidth: 100,
                      height: 36,
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        borderColor: "primary.dark",
                        backgroundColor: "primary.light",
                        opacity: 0.9,
                      },
                    }}
                    onClick={() => {
                      const sessionId = connectedSessions[connection._id];
                      if (!sessionId) {
                        setError("Please connect to the database first.");
                        return;
                      }
                      handleExportClick(sessionId);
                    }}
                    startIcon={<FileDownload />}
                  >
                    Export
                  </Button>

                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={() =>
                        navigate(`/edit-connection/${connection._id}`)
                      }
                      sx={{ color: "text.secondary" }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(connection._id)}
                      sx={{ color: "error.main" }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          ))
        )}

        {/* Snackbars */}
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess("")}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            {success}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ExistingDatabaseConnection;
