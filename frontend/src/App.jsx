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
import LineChart from "./components/graphs/LineChart";
import BarChart from "./components/graphs/BarChart";
import ScatterPlot from "./components/graphs/ScatterPlot";
import Histogram from "./components/graphs/Histogram";
import CandlestickChart from "./components/graphs/CandlestickChart";
import PieChart from "./components/graphs/PieChart";

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
              <Route
                path="/existing-connections"
                element={<ExistingDatabaseConnection />}
              />
              <Route path="/new-connection" element={<DatabaseConnection />} />
              <Route
                path="/edit-connection/:id"
                element={<EditDatabaseConnection />}
              />
              <Route
                path="/graph-visualization"
                element={<VisualizationPage />}
              />
              <Route path="/" element={<LoginPage />} />
              <Route path="/sign-up/" element={<SignUpPage />} />
              <Route
                path="/forgot-password/"
                element={<ForgotPasswordPage />}
              />

              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
              <Route path="/scatter-plot" element={<ScatterPlot />} />
              <Route path="/histogram" element={<Histogram />} />
              <Route path="/candlestick-chart" element={<CandlestickChart />} />
              <Route path="/pie-chart" element={<PieChart />} />
            </Routes>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
