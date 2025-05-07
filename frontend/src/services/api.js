import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
//const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
//const GOOGLE_CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;

// Save a new connection (supports both connection string and form)
export const saveConnection = async (
  connectionData,
  endpoint = "/api/connections"
) => {
  const token = localStorage.getItem("token")
  try {
    
    const response = await axios.post(
      `${API_BASE_URL}${endpoint}`,
      connectionData,{headers: {
        Authorization: `Bearer ${token}`}}
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
export const fetchConnections = (setConnections,setIsLoading,setError) => {
  setIsLoading(true);
  const token = localStorage.getItem("token")
  axios.get(`${API_BASE_URL}/api/connections/`,  {
    headers: {
      Authorization: `Bearer ${token}`
    }
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
    const response = await axios.post(`${API_BASE_URL}/sql/connect_database/${connectionId}`);
    return response.data; // Directly return the parsed data
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    throw error; // optional: rethrow to handle elsewhere
  }
};

// Delete a connection by ID
export const deleteConnection = async (connectionId, connections, setConnections, setSuccess, setError) => {
  try {
    const response = await axios.delete(`http://localhost:8000/api/connections/${connectionId}`);
    

    // If successful, update the state
    setConnections(connections.filter((c) => c._id !== connectionId));
    setSuccess("Connection deleted successfully!");
    return response
  } catch (err) {
    setError("Error deleting connection: " + err.message);
  }
};


//Login form handler nomal email and password form
export const handleSubmit = async (e,Navigate,setError, email,password) => {
  e.preventDefault();
  try{
    const res = await axios.post(`${API_BASE_URL}/api/login`, {
      email,
      password,
    });
    console.log("Login successful:", res.data);
    localStorage.removeItem("token")
    localStorage.setItem("token", `${res.data.access_token}`);
    
    Navigate("/existing-connections");
    
  }catch(err){
    setError("Invalid Credentials")
  }
};

//Signup from hanndler detail form
export const handleSignUp = async (event,formData,setError,Navigate) => {
      event.preventDefault();
      console.log("Form data:", formData);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/signup`,
          formData
        );
        if (response.status === 200) {
          console.log("Sign up successful", response.data);
          localStorage.removeItem("token")
          localStorage.setItem("token", `${response.data.access_token}`);
          Navigate("/existing-connections");
        }
      } catch (err) {
        console.error("Error during sign-up:", err);
        setError("Sign-up failed. Please try again.");
      }
    };
