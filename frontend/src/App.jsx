import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExistingDatabaseConnection from "./pages/ExistingDatabaseConnection";
import DatabaseConnection from "./pages/DatabaseConnection"; // Default import
import EditDatabaseConnection from "./pages/EditDatabaseConnection";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Loading from "./components/Loading";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <Router>
            <Routes>
              {/* Default Route */}
              <Route
                path="/existing-database-connection/"
                element={<ExistingDatabaseConnection />}
              />
              {/* Database Connection Routes */}
              <Route
                path="/existing-connections"
                element={<ExistingDatabaseConnection />}
              />
              <Route path="/new-connection" element={<DatabaseConnection />} />{" "}
              {/* Use the component here */}
              <Route
                path="/edit-connection/:id"
                element={<EditDatabaseConnection />}
              />
              <Route path="/" element={<LoginPage />} />
              <Route path="/sign-up/" element={<SignUpPage />} />
              <Route
                path="/forgot-password/"
                element={<ForgotPasswordPage />}
              />
            </Routes>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
