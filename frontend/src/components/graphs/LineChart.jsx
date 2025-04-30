import React from "react";
import Plot from "react-plotly.js";


/*const type = "line_uni";
const groupedData = [
  { date: "2024-01", value: 100 },
  { date: "2024-02", value: 120 },
  { date: "2024-03", value: 130 },
  { date: "2024-04", value: 125 },
  { date: "2024-05", value: 150 },
];*/


const type = "line_grouped";
const groupedData = [
  { date: "2024-01", category: "A", value: 100 },
  { date: "2024-02", category: "A", value: 120 },
  { date: "2024-03", category: "A", value: 130 },
  { date: "2024-01", category: "B", value: 90 },
  { date: "2024-02", category: "B", value: 110 },
  { date: "2024-03", category: "B", value: 105 },
  { date: "2024-01", category: "C", value: 80 },
  { date: "2024-02", category: "C", value: 95 },
  { date: "2024-03", category: "C", value: 100 },
];

const LineChart = () => {
  let data = [];
  let title = "";

  if (type === "line_uni") {
    title = "Simple Univariate Time Series";
    data = [
      {
        x: groupedData.map((d) => d.date),
        y: groupedData.map((d) => d.value),
        type: "scatter",
        mode: "lines+markers",
        name: "Value",
      },
    ];
  } else if (type === "line_grouped") {
    title = "Grouped Time Series by Category";
    const categories = [...new Set(groupedData.map((d) => d.category))];
    data = categories.map((cat) => {
      const filtered = groupedData.filter((d) => d.category === cat);
      return {
        x: filtered.map((d) => d.date),
        y: filtered.map((d) => d.value),
        type: "scatter",
        mode: "lines+markers",
        name: cat,
      };
    });
  }

  return (
    <Plot
      data={data}
      layout={{
        width: 700,
        height: 500,
        title: { text: title },
        xaxis: { title: "Date" },
        yaxis: { title: "Value" },
      }}
    />
  );
};

export default LineChart;
