import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import ExistingDatabaseConnection from "./pages/ExistingDatabaseConnection";
import DatabaseConnection from "./pages/DatabaseConnection";
import EditDatabaseConnection from "./pages/EditDatabaseConnection";
import VisualizationPage from "./pages/VisualizationPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Loading from "./components/Loading";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 0);
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route
                path="/existing-connections"
                element={
                  <ProtectedRoute>
                    {" "}
                    <ExistingDatabaseConnection />{" "}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/new-connection"
                element={
                  <ProtectedRoute>
                    <DatabaseConnection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-connection/:id"
                element={
                  <ProtectedRoute>
                    <EditDatabaseConnection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/graph-visualization"
                element={
                  <ProtectedRoute>
                    <VisualizationPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/sign-up/" element={<SignUpPage />} />
              <Route
                path="/forgot-password/"
                element={<ForgotPasswordPage />}
              />
              <Route path="/bar-chart" element={<BarChart />} />
            </Routes>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
