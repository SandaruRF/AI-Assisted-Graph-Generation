import React from "react";
import Plot from "react-plotly.js";

const BarChart = () => {
  return (
    <Plot
      data={[{ type: "bar", x: [1, 2, 3], y: [2, 5, 3] }]}
      layout={{ width: 640, height: 480, title: { text: "Bar Chart" } }}
    />
  );
};

export default BarChart;
