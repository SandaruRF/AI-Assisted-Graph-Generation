import React from "react";
import Plot from "react-plotly.js";

const mockData1 = [
  { Value: 450, Category: "Tech" },
  { Value: 300, Category: "Finance" },
  { Value: 200, Category: "Healthcare" },
  { Value: 150, Category: "Energy" },
  { Value: 100, Category: "Retail" },
];

// num_1_cat_1_temp_0  --  mockData1
const type = "num_1_cat_1_temp_0";
const mockData = mockData1;

const PieChart = () => {
  if (!mockData || mockData.length === 0) return null;

  const opacity = 0.7;
  let data = [];
  let title,
    numericKey,
    categoryKey,
    categoryKey1,
    timeKey = "";

  if (type === "num_1_cat_1_temp_0") {
    [numericKey, categoryKey] = Object.keys(mockData[0]);

    data = [
      {
        values: mockData.map((item) => item[numericKey]),
        labels: mockData.map((item) => item[categoryKey]),
        type: "pie",
        opacity: opacity,
        showlegend: true,
        legendgrouptitle: { text: categoryKey },
        hoverinfo: "text",
        text: mockData.map((item) => `${numericKey}: ${item[numericKey]}`),
      },
    ];
    title = "Basic Pie Chart";
  }
  const layout = {
    width: 640,
    height: 480,
    title: { text: title },
  };

  return <Plot data={data} layout={layout} />;
};

export default PieChart;
