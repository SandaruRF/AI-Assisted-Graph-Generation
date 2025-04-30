import React from "react";
import Plot from "react-plotly.js";

// const type = "num_1_cat_1_temp_0";
// const mockData = [
//   { Product: "Product A", Revenue: 12500 },
//   { Product: "Product B", Revenue: 8700 },
//   { Product: "Product C", Revenue: 15300 },
//   { Product: "Product D", Revenue: 10100 },
//   { Product: "Product E", Revenue: 13800 },
// ];

const type = "num_1_cat_2_temp_0";
const mockData = [
  { Product: "Laptop", Region: "North", Sales: 15000 },
  { Product: "Laptop", Region: "South", Sales: 12000 },
  { Product: "Laptop", Region: "East", Sales: 13500 },
  { Product: "Laptop", Region: "West", Sales: 11000 },
  { Product: "Laptop", Region: "Central", Sales: 12500 },

  { Product: "Phone", Region: "North", Sales: 10000 },
  { Product: "Phone", Region: "South", Sales: 9000 },
  { Product: "Phone", Region: "East", Sales: 9500 },
  { Product: "Phone", Region: "West", Sales: 8700 },
  { Product: "Phone", Region: "Central", Sales: 9100 },

  { Product: "Tablet", Region: "North", Sales: 8000 },
  { Product: "Tablet", Region: "South", Sales: 8500 },
  { Product: "Tablet", Region: "East", Sales: 7800 },
  { Product: "Tablet", Region: "West", Sales: 7200 },
  { Product: "Tablet", Region: "Central", Sales: 7600 },
];

const BarChart = () => {
  let data = [];
  let data_1 = [];
  let barmode = [];
  let barmode_1 = [];

  if (type === "num_1_cat_1_temp_0") {
    data = [
      {
        x: mockData.map((item) => Object.values(item)[0]),
        y: mockData.map((item) => Object.values(item)[1]),
        type: "bar",
      },
    ];
  } else if (type === "num_1_cat_2_temp_0") {
    const cat_1 = [...new Set(mockData.map((item) => Object.values(item)[0]))];
    const cat_2 = [...new Set(mockData.map((item) => Object.values(item)[1]))];

    barmode = "group";
    data = cat_2.map((cat_2_val) => {
      return {
        x: cat_1,
        y: cat_1.map((cat_1_val) => {
          const foundItem = mockData.find(
            (item) =>
              Object.values(item)[0] === cat_1_val &&
              Object.values(item)[1] === cat_2_val
          );
          return foundItem ? Object.values(foundItem)[2] : 0;
        }),
        name: cat_2_val,
        type: "bar",
      };
    });

    barmode_1 = "stack";
    data_1 = cat_2.map((cat_2_val) => {
      return {
        x: cat_1,
        y: cat_1.map((cat_1_val) => {
          const foundItem = mockData.find(
            (item) =>
              Object.values(item)[0] === cat_1_val &&
              Object.values(item)[1] === cat_2_val
          );
          return foundItem ? Object.values(foundItem)[2] : 0;
        }),
        name: cat_2_val,
        type: "bar",
      };
    });
  }

  return (
    <div>
      <Plot
        data={data}
        layout={{
          width: 640,
          height: 480,
          title: { text: "Bar Chart" },
          barmode: { barmode },
        }}
      />
      <Plot
        data={data_1}
        layout={{
          width: 640,
          height: 480,
          title: { text: "Bar Chart" },
          barmode: { barmode_1 },
        }}
      />
    </div>
  );
};

export default BarChart;
