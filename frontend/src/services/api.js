import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;
//const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
//const GOOGLE_CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;

// Save a new connection (supports both connection string and form)
export const saveConnection = async (
  connectionData,
  endpoint = "/api/connections"
) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_BASE_URL}${endpoint}`,
      connectionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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

//fetch existing connections
export const fetchConnections = (setConnections, setIsLoading, setError) => {
  setIsLoading(true);
  const token = localStorage.getItem("token");
  axios
    .get(`${API_BASE_URL}/api/connections/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const data = res.data;
      if (Array.isArray(data)) {
        setConnections(data);
      } else if (Array.isArray(data.connections)) {
        setConnections(data.connections);
      } else {
        throw new Error("Unexpected response structure");
      }
      setIsLoading(false);
    })
    .catch((err) => {
      setError("Error loading connections: " + err.message);
      setIsLoading(false);
    });
};

//connect to a database using the connection ID
export const connectToDatabase = async (connectionId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sql/connect_database/${connectionId}`
    );
    return response.data; // Directly return the parsed data
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    throw error; // optional: rethrow to handle elsewhere
  }
};

// Delete a connection by ID
export const deleteConnection = async (
  connectionId,
  connections,
  setConnections,
  setSuccess,
  setError
) => {
  try {
    const response = await axios.delete(
      `http://localhost:8000/api/connections/${connectionId}`
    );

    // If successful, update the state
    setConnections(connections.filter((c) => c._id !== connectionId));
    setSuccess("Connection deleted successfully!");
    return response;
  } catch (err) {
    setError("Error deleting connection: " + err.message);
  }
};

//Login form handler nomal email and password form
export const handleSubmit = async (e, Navigate, setError, email, password) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${API_BASE_URL}/api/login`, {
      email,
      password,
    });
    console.log("Login successful:", res.data);
    localStorage.removeItem("token");
    localStorage.setItem("token", `${res.data.access_token}`);

    Navigate("/existing-connections");
  } catch (err) {
    setError("Invalid Credentials");
  }
};

//Signup part 1 from hanndler detail form
export const handleSignUp = async (event, formData, setError, Navigate) => {
  event.preventDefault();
  console.log("Form data:", formData);
  try {
    const response = await axios.post(`${API_BASE_URL}/api/signup`, formData);
    if (response.status === 200) {
      console.log("Data sent successful.", response.data);
      localStorage.removeItem("email");
      localStorage.setItem("email", `${formData.email}`);
      Navigate("/sign-up-p2");
    }
  } catch (err) {
    console.error("Error during signup:", err);
    setError("Signup failed. Please try again.");
  }
};

//Signup part 2 from handler name and phone number form
export const handleSignUpP2 = async (
  event,
  firstName,
  lastName,
  phoneNumber,
  Navigate,
  setError
) => {
  event.preventDefault();
  console.log("Form data:", firstName, lastName, phoneNumber);
  try {
    const response = await axios.post(`${API_BASE_URL}/api/signup/2`, {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email: localStorage.getItem("email"),
    });
    if (response.status === 200) {
      console.log("Data sent successful.", response.data);
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.setItem("token", `${response.data.access_token}`);
      Navigate("/existing-connections");
    }
  } catch (err) {
    console.error("Error during signup:", err);
    setError("Signup failed. Please try again.");
  }
};

//Google signup / Login handler
export const handleGoogleLogin = async (credentialResponse, Navigate) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/google`, {
      token: credentialResponse.credential,
    });
    if (res.data.message === "New User created") {
      localStorage.removeItem("email", "token");
      localStorage.setItem("email", `${res.data.email}`);
      Navigate("/sign-up-p2");
    } else if (res.data.message === "user already exists") {
      localStorage.removeItem("token");
      localStorage.setItem("token", `${res.data.access_token}`);
      Navigate("/existing-connections");
    } else {
      console.error("Unexpected response:", res);
      throw new Error("Unexpected response from server");
    }
    console.log("Login successful", res.data);
  } catch (err) {
    console.error("Login failed", err);
  }
};

//github login signup handler
export const handleGitHubAuth = (setError) => {
  setError(null);
  try {
    const clientId = GITHUB_CLIENT_ID;
    const redirectUri = "http://localhost:3000/github-callback";

    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
  } catch (err) {
    setError("Failed to initiate GitHub login");
  }
};

//github auth callback handler
export const handleGitHubAuthCallback = async (code, Navigate) => {
  if (code) {
    axios
      .post(`${API_BASE_URL}/api/auth/github`, { code })
      .then((res) => {
        if (res.data.message === "New User created") {
          localStorage.removeItem("email", "token");
          localStorage.setItem("email", `${res.data.email}`);
          Navigate("/sign-up-p2");
        } else if (res.data.message === "user already exists") {
          localStorage.removeItem("token");
          localStorage.setItem("token", `${res.data.access_token}`);
          Navigate("/existing-connections");
        } else {
          console.error("Unexpected response:", res);
          throw new Error("Unexpected response from server");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
};
