import React from "react";
import Plot from "react-plotly.js";

const mockData1 = [
  { Value: 450, Category: "Tech" },
  { Value: 300, Category: "Finance" },
  { Value: 200, Category: "Healthcare" },
  { Value: 150, Category: "Energy" },
  { Value: 100, Category: "Retail" },
];

const mockData2 = [
  { Value: 120, Region: "North", Product: "Electronics" },
  { Value: 80, Region: "North", Product: "Furniture" },
  { Value: 60, Region: "North", Product: "Clothing" },
  { Value: 100, Region: "South", Product: "Electronics" },
  { Value: 90, Region: "South", Product: "Furniture" },
  { Value: 50, Region: "South", Product: "Clothing" },
  { Value: 110, Region: "East", Product: "Electronics" },
  { Value: 70, Region: "East", Product: "Furniture" },
  { Value: 40, Region: "East", Product: "Clothing" },
  { Value: 130, Region: "West", Product: "Electronics" },
  { Value: 85, Region: "West", Product: "Furniture" },
  { Value: 55, Region: "West", Product: "Clothing" },
];

// num_1_cat_1_temp_0  --  mockData1
// num_1_cat_2_temp_0  --  mockData2
const type = "num_1_cat_1_temp_0";
const mockData = mockData1;

const PieChart = () => {
  if (!mockData || mockData.length === 0) return null;

  const opacity = 0.7;
  let data = [];
  let title,
    numericKey,
    categoryKey,
    categoryKey1 = "";

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
        hovertext: mockData.map(
          (item) =>
            `${categoryKey}: ${item[categoryKey]}<br>${numericKey}: ${item[numericKey]}`
        ),
        text: mockData.map((item) => `${numericKey}: ${item[numericKey]}`),
      },
    ];
    title = "Basic Pie Chart";
  } else if (type === "num_1_cat_2_temp_0") {
    [numericKey, categoryKey, categoryKey1] = Object.keys(mockData[0]);
    const categories = [...new Set(mockData.map((item) => item[categoryKey]))];
    const categories1 = [
      ...new Set(mockData.map((item) => item[categoryKey1])),
    ];
    if (categories.length > categories1.length) {
      let temp = categoryKey;
      categoryKey = categoryKey1;
      categoryKey1 = temp;
    }

    const labels = [];
    const parents = [];
    const values = [];
    const text = [];
    const hovertext = [];

    const parentSums = {};
    const parentNodes = new Set();

    // First, calculate the parent sums
    for (const row of mockData) {
      const parent = row[categoryKey];
      const value = row[numericKey];

      parentSums[parent] = (parentSums[parent] || 0) + value;
    }

    // Add parent nodes
    let totalSum = 0; // Sum of all values for percentage calculation
    for (const parent in parentSums) {
      totalSum += parentSums[parent];
    }

    // Add parent nodes with percentage
    for (const parent in parentSums) {
      const percentage = (parentSums[parent] / totalSum) * 100;
      labels.push(parent);
      parents.push("");
      values.push(parentSums[parent]);
      text.push(`${percentage.toFixed(2)}%`);
      hovertext.push(
        `${categoryKey}: ${parent}<br>Total ${numericKey}: ${parentSums[parent]}`
      );
      parentNodes.add(parent);
    }

    // Add unique child nodes with percentage
    for (const row of mockData) {
      const parent = row[categoryKey];
      const child = row[categoryKey1];
      const value = row[numericKey];

      const uniqueLabel = `${parent} - ${child}`; // unique child
      const percentage = (value / totalSum) * 100; // Calculate percentage for each child

      labels.push(uniqueLabel);
      parents.push(parent);
      values.push(value);
      text.push(`${percentage.toFixed(2)}%`);
      hovertext.push(
        `${categoryKey}: ${parent}<br>${categoryKey1}: ${child}<br>${numericKey}: ${value}`
      );
    }

    data = [
      {
        type: "sunburst",
        labels,
        parents,
        values,
        branchvalues: "total",
        text,
        hovertext,
        hoverinfo: "text",
      },
    ];
    title = "Grouped Pie Chart (Sunburst)";
  }

  const layout = {
    width: 640,
    height: 480,
    title: { text: title },
  };

  return <Plot data={data} layout={layout} />;
};

export default PieChart;
