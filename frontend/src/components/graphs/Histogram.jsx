import React from "react";
import Plot from "react-plotly.js";

const mockData1 = [
  { CustomerAge: 18 },
  { CustomerAge: 21 },
  { CustomerAge: 23 },
  { CustomerAge: 25 },
  { CustomerAge: 26 },
  { CustomerAge: 27 },
  { CustomerAge: 28 },
  { CustomerAge: 30 },
  { CustomerAge: 31 },
  { CustomerAge: 33 },
  { CustomerAge: 35 },
  { CustomerAge: 36 },
  { CustomerAge: 37 },
  { CustomerAge: 38 },
  { CustomerAge: 39 },
  { CustomerAge: 40 },
  { CustomerAge: 42 },
  { CustomerAge: 45 },
  { CustomerAge: 47 },
  { CustomerAge: 50 },
  { CustomerAge: 52 },
  { CustomerAge: 55 },
  { CustomerAge: 60 },
  { CustomerAge: 65 },
  { CustomerAge: 70 },
];

const mockData2 = [
  { Salary: 35000, Gender: "Male" },
  { Salary: 42000, Gender: "Male" },
  { Salary: 39000, Gender: "Male" },
  { Salary: 47000, Gender: "Male" },
  { Salary: 50000, Gender: "Male" },
  { Salary: 38000, Gender: "Female" },
  { Salary: 41000, Gender: "Female" },
  { Salary: 45000, Gender: "Female" },
  { Salary: 47000, Gender: "Female" },
  { Salary: 52000, Gender: "Female" },
  { Salary: 36000, Gender: "Other" },
  { Salary: 40000, Gender: "Other" },
  { Salary: 43000, Gender: "Other" },
  { Salary: 46000, Gender: "Other" },
  { Salary: 49000, Gender: "Other" },
];

// num_1_cat_0_temp_0  --  mockData1
// num_1_cat_1_temp_0  --  mockData2
const type = "num_1_cat_1_temp_0";
const mockData = mockData2;

const Histogram = () => {
  if (!mockData || mockData.length === 0) return null;

  let data = [];
  let title,
    barmode,
    xKey,
    yKey,
    categoryKey,
    categoryKey1,
    timeKey = "";

  if (type === "num_1_cat_0_temp_0") {
    [xKey] = Object.keys(mockData[0]);
    data = [
      {
        x: mockData.map((item) => item[xKey]),
        type: "histogram",
      },
    ];

    title = "Basic Histogram";
  } else if (type === "num_1_cat_1_temp_0") {
    [xKey, categoryKey] = Object.keys(mockData[0]);
    const categories = [...new Set(mockData.map((item) => item[categoryKey]))];

    data = categories.map((category, i) => {
      const filtered = mockData.filter(
        (item) => item[categoryKey] === category
      );
      return {
        x: filtered.map((item) => item[xKey]),
        type: "histogram",
        opacity: 0.6,
        name: category,
        showlegend: true,
        ...(i === 0 && { legendgrouptitle: { text: categoryKey } }),
      };
    });

    title = "Grouped Histogram";
    barmode = "overlay";
  }

  const layout = {
    width: 640,
    height: 480,
    title: { text: title },
    xaxis: { title: { text: xKey } },
    yaxis: { title: { text: yKey } },
    barmode: barmode,
  };

  return <Plot data={data} layout={layout} />;
};

export default Histogram;
