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
  { Product: "Product A", Region: "North", Sales: 12000 },
  { Product: "Product A", Region: "South", Sales: 9500 },
  { Product: "Product A", Region: "East", Sales: 10200 },
  { Product: "Product B", Region: "North", Sales: 8700 },
  { Product: "Product B", Region: "South", Sales: 7300 },
  { Product: "Product B", Region: "East", Sales: 8000 },
  { Product: "Product C", Region: "North", Sales: 15000 },
  { Product: "Product C", Region: "South", Sales: 13400 },
  { Product: "Product C", Region: "East", Sales: 14100 },
];

const BarChart = () => {
  let data = [];

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
  }

  return (
    <Plot
      data={data}
      layout={{ width: 640, height: 480, title: { text: "Bar Chart" } }}
    />
  );
};

export default BarChart;
