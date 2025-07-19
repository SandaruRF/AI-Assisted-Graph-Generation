import { Navigate } from "react-router-dom";

// This component checks if the user is authenticated by checking for a token in localStorage.
export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
}
