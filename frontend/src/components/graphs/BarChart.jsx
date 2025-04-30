import React from "react";
import Plot from "react-plotly.js";

const type = "num_1_cat_2_temp_0";

const mockData1 = [
  { Product: "Product A", Revenue: 12500 },
  { Product: "Product B", Revenue: 8700 },
  { Product: "Product C", Revenue: 15300 },
  { Product: "Product D", Revenue: 10100 },
  { Product: "Product E", Revenue: 13800 },
];

const mockData2 = [
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

const generateGroupedOrStackedData = (data, orientation = "v") => {
  const cat1 = [...new Set(data.map((item) => Object.values(item)[0]))];
  const cat2 = [...new Set(data.map((item) => Object.values(item)[1]))];

  return cat2.map((cat_2_val) => ({
    [orientation === "v" ? "x" : "y"]: cat1,
    [orientation === "v" ? "y" : "x"]: cat1.map((cat_1_val) => {
      const entry = data.find(
        (item) =>
          Object.values(item)[0] === cat_1_val &&
          Object.values(item)[1] === cat_2_val
      );
      return entry ? Object.values(entry)[2] : 0;
    }),
    name: cat_2_val,
    type: "bar",
    orientation: orientation === "h" ? "h" : undefined,
  }));
};

const BarChart = () => {
  const charts = [];

  if (type === "num_1_cat_1_temp_0") {
    const x = mockData1.map((item) => Object.values(item)[0]);
    const y = mockData1.map((item) => Object.values(item)[1]);

    charts.push({
      title: "Basic Bar Chart",
      data: [{ x, y, type: "bar" }],
    });

    charts.push({
      title: "Horizontal Basic Bar Chart",
      data: [{ x: y, y: x, type: "bar", orientation: "h" }],
    });
  } else if (type === "num_1_cat_2_temp_0") {
    charts.push({
      title: "Grouped Bar Chart",
      data: generateGroupedOrStackedData(mockData2, "v"),
      barmode: "group",
    });

    charts.push({
      title: "Stacked Bar Chart",
      data: generateGroupedOrStackedData(mockData2, "v"),
      barmode: "stack",
    });

    charts.push({
      title: "Horizontal Stacked Bar Chart",
      data: generateGroupedOrStackedData(mockData2, "h"),
      barmode: "stack",
    });

    charts.push({
      title: "Horizontal Grouped Bar Chart",
      data: generateGroupedOrStackedData(mockData2, "h"),
      barmode: "group",
    });
  }

  return (
    <div>
      {charts.map((chart, index) => (
        <Plot
          key={index}
          data={chart.data}
          layout={{
            width: 640,
            height: 480,
            title: { text: chart.title },
            barmode: chart.barmode,
          }}
        />
      ))}
    </div>
  );
};

export default BarChart;
