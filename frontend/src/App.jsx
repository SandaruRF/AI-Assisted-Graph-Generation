import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExistingDatabaseConnection from "./pages/ExistingDatabaseConnection";
import DatabaseConnection from "./pages/DatabaseConnection";
import EditDatabaseConnection from "./pages/EditDatabaseConnection";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/existing-connections"
          element={<ExistingDatabaseConnection />}
        />
        <Route path="/new-connection" element={<DatabaseConnection />} />
        <Route
          path="/edit-connection/:id"
          element={<EditDatabaseConnection />}
        />
      </Routes>
    </Router>
  );
}

export default App;
