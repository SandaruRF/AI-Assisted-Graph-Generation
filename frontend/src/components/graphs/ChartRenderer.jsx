import React from "react";

import BoxPlotChart from "./BoxPlot";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import ScatterPlot from "./ScatterPlot";
import Histogram from "./Histogram";
import CandlestickChart from "./CandlestickChart";
import AreaChart from "./AreaChart";
import BarChart from "./BarChart";

const ChartRenderer = ({ typeString, dataset }) => {
  if (!typeString || !dataset || dataset.length === 0)
    return <div>No data or chart type provided</div>;

  if (typeString.includes("box")) {
    return <BoxPlotChart typeString={typeString} dataset={dataset} />;
  }

  if (typeString.includes("line")) {
    return <LineChart typeString={typeString} dataset={dataset} />;
  }

  if (typeString.includes("pie")) {
    return <PieChart typeString={typeString} dataset={dataset} />;
  }

  if (typeString.includes("scatter")) {
    return <ScatterPlot typeString={typeString} dataset={dataset} />;
  }

  if (typeString.includes("hist")) {
    return <Histogram typeString={typeString} dataset={dataset} />;
  }

  if (typeString.includes("candle")) {
    return <CandlestickChart typeString={typeString} dataset={dataset} />;
  }

  if (typeString.includes("area")) {
    return <AreaChart typeString={typeString} dataset={dataset} />;
  }

  if (typeString.includes("bar")) {
    return <BarChart typeString={typeString} dataset={dataset} />;
  }

  // Fallback logic based on typeString patterns
  if (typeString.startsWith("num_3_cat_2")) {
    return <ScatterPlot typeString={typeString} dataset={dataset} />;
  } else if (typeString.startsWith("num_2_cat_1") && typeString.includes("temp_1")) {
    return <LineChart typeString={typeString} dataset={dataset} />;
  } else if (typeString.startsWith("num_1_cat_2")) {
    return <BoxPlotChart typeString={typeString} dataset={dataset} />;
  }

  return <div>Unknown chart type: {typeString}</div>;
};

export default ChartRenderer;