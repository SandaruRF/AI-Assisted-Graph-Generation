import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExistingDatabaseConnection from "./pages/ExistingDatabaseConnection";
import DatabaseConnection from "./pages/DatabaseConnection"; // Default import
import EditDatabaseConnection from "./pages/EditDatabaseConnection"; // Import the Edit component

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<ExistingDatabaseConnection />} />
        {/* Database Connection Routes */}
        <Route
          path="/existing-connections"
          element={<ExistingDatabaseConnection />}
        />
        <Route path="/new-connection" element={<DatabaseConnection />} />{" "}
        {/* Create New Connection */}
        <Route
          path="/edit-connection/:id"
          element={<EditDatabaseConnection />}
        />{" "}
        {/* Edit Connection by ID */}
      </Routes>
    </Router>
  );
}

export default App;
