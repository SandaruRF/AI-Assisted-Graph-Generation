import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExistingDatabaseConnection from "./pages/ExistingDatabaseConnection";
import DatabaseConnection from "./pages/DatabaseConnection"; // Default import
import EditDatabaseConnection from "./pages/EditDatabaseConnection";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<ExistingDatabaseConnection />} />

        {/* Database Connection Routes */}
        <Route path="/existing-connections" element={<ExistingDatabaseConnection />} />
        <Route path="/new-connection" element={<DatabaseConnection />} /> {/* Use the component here */}
        <Route path="/edit-connection/:id" element={<EditDatabaseConnection />} />
        <Route path="/log-in/" element={<LoginPage />} />
        <Route path="/sign-up/" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;