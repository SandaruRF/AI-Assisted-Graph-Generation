import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

// Save a new connection (supports both connection string and form)
export const saveConnection = async (
  connectionData,
  endpoint = "/api/connections"
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${endpoint}`,
      connectionData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to save connection"
    );
  }
};

// Get a single connection by ID (for editing)
export const getConnectionById = async (connectionId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/connections/${connectionId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch connection data"
    );
  }
};

// Update an existing connection
export const updateConnection = async (connectionId, updatedConnectionData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/connections/${connectionId}`,
      updatedConnectionData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to update connection"
    );
  }
};
