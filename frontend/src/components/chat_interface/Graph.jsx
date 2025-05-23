import React, { useState, useMemo } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import CandlestickChart from "../../components/graphs/CandlestickChart";
import AreaChart from "../../components/graphs/AreaChart";
import LineChart from "../../components/graphs/LineChart";
import BarChart from "../../components/graphs/BarChart";
import BoxPlot from "../../components/graphs/BoxPlot";
import Histogram from "../../components/graphs/Histogram";
import PieChart from "../../components/graphs/PieChart";
import ScatterPlot from "../../components/graphs/ScatterPlot";

const Graph = ({ num_numeric, num_cat, num_temporal, types, data, chart_type, colors, x_label, y_label, legend_labels }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const typeString =
    "num_" + num_numeric + "_cat_" + num_cat + "_temp_" + num_temporal;

  const graphTypes = useMemo(() => {
    try {
      if (types && typeof types === "string") {
        const parsed = JSON.parse(types);
        if (
          parsed?.recommended_graphs &&
          Array.isArray(parsed.recommended_graphs)
        ) {
          return parsed.recommended_graphs;
        }
      }
    } catch (error) {
      console.error("Failed to parse recommended_graphs:", error);
    }
    return []; // fallback
  }, [types]);

  // safe hook usage
  const [selectedGraph, setSelectedGraph] = useState(
    graphTypes.length ? graphTypes[0] : null
  );

  // skip rendering
  if (!graphTypes.length || !selectedGraph) {
    return null;
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (graphType) => {
    setAnchorEl(null);
    if (graphType) {
      setSelectedGraph(graphType);
    }
  };

  if (!graphTypes.length || !selectedGraph) return null;

  // Common props to pass to all chart components
  const chartProps = {
    typeString,
    dataset: data,
    colors,
    xLabel: x_label,
    yLabel: y_label,
    legendLabels: legend_labels,
  };

  return (
    <Box sx={{ p: 2 }}>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        size="small"
        sx={{
          fontSize: "12px", // Change text size
          width: "180px",
          height: "30px",
          backgroundColor: "#1976d2", // Custom background (overrides color prop)
          color: "#fff", // Custom text color
          "&:hover": {
            backgroundColor: "#1565c0", // Hover color
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
              display: "inline-block",
            }}
          >
            {selectedGraph}
          </span>
          <KeyboardArrowDownIcon />
        </Box>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose()}
      >
        {graphTypes.map((type, index) => (
          <MenuItem key={index} onClick={() => handleClose(type)}>
            {type}
          </MenuItem>
        ))}
      </Menu>

 <Box sx={{ mt: 3 }}>
        {selectedGraph === "Candlestick Chart" && <CandlestickChart {...chartProps} />}
        {selectedGraph === "Area Chart" && <AreaChart {...chartProps} />}
        {selectedGraph === "Line Chart" && <LineChart {...chartProps} />}
        {selectedGraph === "Bar Chart" && <BarChart {...chartProps} />}
        {selectedGraph === "Box Plot" && <BoxPlot {...chartProps} />}
        {selectedGraph === "Histogram" && <Histogram {...chartProps} />}
        {selectedGraph === "Pie Chart" && <PieChart {...chartProps} />}
        {selectedGraph === "Scatter Plot" && <ScatterPlot {...chartProps} />}
      </Box>
    </Box>
  );
};

export default Graph;
