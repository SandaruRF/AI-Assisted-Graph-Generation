import React, { useState, useMemo, useRef } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";

import CandlestickChart from "../../components/graphs/CandlestickChart";
import AreaChart from "../../components/graphs/AreaChart";
import LineChart from "../../components/graphs/LineChart";
import BarChart from "../../components/graphs/BarChart";
import BoxPlot from "../../components/graphs/BoxPlot";
import Histogram from "../../components/graphs/Histogram";
import PieChart from "../../components/graphs/PieChart";
import ScatterPlot from "../../components/graphs/ScatterPlot";
import GraphInteractionTracker from "../../components/GraphInteractionTracker";

const Graph = ({ num_numeric, num_cat, num_temporal, types, data }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Interaction counts lifted here to sync with tracker
  const [exportCount, setExportCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  // Construct a string for type info (optional, used in charts)
  const typeString =
    "num_" + num_numeric + "_cat_" + num_cat + "_temp_" + num_temporal;

  // Parse graph types from the `types` string prop
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
    return []; // fallback empty array
  }, [types]);

  // Selected graph state
  const [selectedGraph, setSelectedGraph] = useState(
    graphTypes.length ? graphTypes[0] : null
  );

  // Ref for graph container to track interactions
  const graphContainerRef = useRef(null);

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
      // Reset counts on graph change if desired
      // setExportCount(0);
      // setLikeCount(0);
      // setDislikeCount(0);
    }
  };

  // Render selected chart component
  const renderChart = () => {
    switch (selectedGraph) {
      case "Candlestick Chart":
        return <CandlestickChart typeString={typeString} dataset={data} />;
      case "Area Chart":
        return <AreaChart typeString={typeString} dataset={data} />;
      case "Line Chart":
        return <LineChart typeString={typeString} dataset={data} />;
      case "Bar Chart":
        return <BarChart typeString={typeString} dataset={data} />;
      case "Box Plot":
        return <BoxPlot typeString={typeString} dataset={data} />;
      case "Histogram":
        return <Histogram typeString={typeString} dataset={data} />;
      case "Pie Chart":
        return <PieChart typeString={typeString} dataset={data} />;
      case "Scatter Plot":
        return <ScatterPlot typeString={typeString} dataset={data} />;
      default:
        return null;
    }
  };

  // Handlers for Like, Dislike, Export buttons
  const handleLike = () => setLikeCount((c) => c + 1);
  const handleDislike = () => setDislikeCount((c) => c + 1);
  const handleExport = () => setExportCount((c) => c + 1);

  return (
    <Box sx={{ p: 2 }}>
      {/* Dropdown to select graph type */}
      <Button
        id="graph-select-button"
        aria-controls={open ? "graph-select-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        size="small"
        sx={{
          fontSize: "12px",
          width: "180px",
          height: "30px",
          backgroundColor: "#1976d2",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#1565c0",
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

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        id="graph-select-menu"
      >
        {graphTypes.map((type, index) => (
          <MenuItem key={index} onClick={() => handleClose(type)}>
            {type}
          </MenuItem>
        ))}
      </Menu>

      {/* Graph container */}
      <Box sx={{ mt: 3 }} ref={graphContainerRef}>
        <GraphInteractionTracker
          graphName={selectedGraph}
          containerRef={graphContainerRef}
          externalExportCount={exportCount}
          externalLikeCount={likeCount}
          externalDislikeCount={dislikeCount}
        />

        {renderChart()}

        {/* Buttons below the graph */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            alignItems: "center",
            mr: 2,
          }}
        >
          <Tooltip title="Like">
            <IconButton
              aria-label="like"
              color={likeCount > 0 ? "default" : "default"}
              onClick={handleLike}
            >
              {likeCount > 0 ? (
                <ThumbUpIcon sx={{ width: "20px", height: "20px" }} />
              ) : (
                <ThumbUpOutlinedIcon sx={{ width: "20px", height: "20px" }} />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Dislike">
            <IconButton
              aria-label="dislike"
              color={dislikeCount > 0 ? "default" : "default"}
              onClick={handleDislike}
            >
              {dislikeCount > 0 ? (
                <ThumbDownIcon sx={{ width: "20px", height: "20px" }} />
              ) : (
                <ThumbDownOutlinedIcon sx={{ width: "20px", height: "20px" }} />
              )}
            </IconButton>
          </Tooltip>

          {/* <Tooltip title="Export">
            <IconButton aria-label="export" onClick={handleExport}>
              <GetAppIcon />
            </IconButton>
          </Tooltip> */}
        </Box>
      </Box>
    </Box>
  );
};

export default Graph;
