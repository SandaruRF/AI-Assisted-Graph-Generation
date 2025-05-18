import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import ExistingDatabaseConnection from "./pages/ExistingDatabaseConnection";
import DatabaseConnection from "./pages/DatabaseConnection";
import EditDatabaseConnection from "./pages/EditDatabaseConnection";
import VisualizationPage from "./pages/VisualizationPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Test from "./pages/Test";
import Loading from "./components/Loading";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LandingPage from "./pages/LandingPage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { ProtectedRoute } from "./components/ProtectedRoute";
import BarChart from "./components/graphs/BarChart";

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
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
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
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Routes>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
