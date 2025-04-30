import React from "react";
import Plot from "react-plotly.js";

const type = "num_1_cat_0_temp_1";
const Data = [
  { date: "2023-01", value: 419.0 },
  { date: "2023-02", value: 420.1 },
  { date: "2023-03", value: 421.3 },
  { date: "2023-04", value: 423.2 },
  { date: "2023-05", value: 424.0 },
  { date: "2023-06", value: 422.5 },
  { date: "2023-07", value: 420.8 },
  { date: "2023-08", value: 419.9 },
  { date: "2023-09", value: 418.4 },
  { date: "2023-10", value: 417.5 },
  { date: "2023-11", value: 418.0 },
  { date: "2023-12", value: 418.7 },
];

/*const type = "num_1_cat_1_temp_1";
const Data = [
  { date: "2023-01", category: "Clothing", value: 27.1 },
  { date: "2023-01", category: "Electronics", value: 92.3 },
  { date: "2023-01", category: "Groceries", value: 71.5 },

  { date: "2023-02", category: "Clothing", value: 26.8 },
  { date: "2023-02", category: "Furniture", value: 13.2 },
  { date: "2023-02", category: "Groceries", value: 72.4 },

  { date: "2023-03", category: "Clothing", value: 28.5 },
  { date: "2023-03", category: "Electronics", value: 95.1 },

  { date: "2023-04", category: "Clothing", value: 29.2 },
  { date: "2023-04", category: "Furniture", value: 14.4 },
  { date: "2023-04", category: "Groceries", value: 75.2 },

  { date: "2023-05", category: "Electronics", value: 96.7 },
  { date: "2023-05", category: "Groceries", value: 76.1 },

  { date: "2023-06", category: "Furniture", value: 15.0 },
  { date: "2023-06", category: "Clothing", value: 30.3 }

];*/

const LineChart = () => {
  let data = [];
  let layout = {};

  if (type === "num_1_cat_0_temp_1") {
    data = [
      {
        x: Data.map((d) => `${d.date}-01`),
        y: Data.map((d) => d.value),
        type: "scatter",
        mode: "lines+markers",
        line: { shape: "linear" },
        name: "Value",
      },
    ];

    layout = {
      title: "Univariate Time Series Line Chart",
      xaxis: {
        title: "Date",
        type: "date",
      },
      yaxis: {
        title: "Value",
      },
      width: 700,
      height: 500,
    };
  } else if (type === "num_1_cat_1_temp_1") {
    const categories = [...new Set(Data.map((d) => d.category))];

    data = categories.map((category) => {
      const filtered = Data.filter((d) => d.category === category);
      return {
        x: filtered.map((d) => `${d.date}-01`),
        y: filtered.map((d) => d.value),
        type: "scatter",
        mode: "lines+markers",
        name: category,
      };
    });

    layout = {
      title: "Grouped Time Series Line Chart by Category",
      xaxis: {
        title: "Date",
        type: "date",
      },
      yaxis: {
        title: "Value",
      },
      width: 700,
      height: 500,
    };
  }

  return (
    <div>
      <Plot data={data} layout={layout} />
    </div>
  );
};

export default LineChart;
