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
import LandingPage from"./pages/LandingPage";
import AboutUs from"./pages/AboutUs";
import ContactUs from"./pages/ContactUs";
import PrivacyPolicy from"./pages/PrivacyPolicy";

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
              <Route path="/existing-connections" element={<ExistingDatabaseConnection />} />
              <Route path="/new-connection" element={<DatabaseConnection />} />
              <Route path="/edit-connection/:id" element={<EditDatabaseConnection />} />
              <Route path="/graph-visualization" element={<VisualizationPage />} />
              <Route path="/" element={<LoginPage />} />
              <Route path="/sign-up/" element={<SignUpPage />} />
              <Route path="/forgot-password/" element={<ForgotPasswordPage />} />
              <Route path="/LandingPage" element={<LandingPage />} />
              <Route path="/about/" element={<AboutUs />} />
              <Route path="/contact/" element={<ContactUs />} />
              <Route path="/privacy/" element={<PrivacyPolicy />} />
            </Routes>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;