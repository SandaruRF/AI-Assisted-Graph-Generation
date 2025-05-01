import React from "react";
import Plot from "react-plotly.js";

const mockData1 = [
  { Product: "Product A", Revenue: 12500 },
  { Product: "Product B", Revenue: 8700 },
  { Product: "Product C", Revenue: 15300 },
  { Product: "Product D", Revenue: 10100 },
  { Product: "Product E", Revenue: 13800 },
];

const mockData2 = [
  { Month: "2024-01", Sales: 12000 },
  { Month: "2024-02", Sales: 13500 },
  { Month: "2024-03", Sales: 12800 },
  { Month: "2024-04", Sales: 14500 },
  { Month: "2024-05", Sales: 15200 },
  { Month: "2024-06", Sales: 13900 },
];

const mockData3 = [
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

const mockData4 = [
  { Month: "2024-01", Region: "North", Sales: 5000 },
  { Month: "2024-01", Region: "South", Sales: 7000 },
  { Month: "2024-02", Region: "North", Sales: 6000 },
  { Month: "2024-02", Region: "South", Sales: 7500 },
  { Month: "2024-03", Region: "North", Sales: 5800 },
  { Month: "2024-03", Region: "South", Sales: 7000 },
  { Month: "2024-04", Region: "North", Sales: 6400 },
  { Month: "2024-04", Region: "South", Sales: 8100 },
  { Month: "2024-05", Region: "North", Sales: 7000 },
  { Month: "2024-05", Region: "South", Sales: 8200 },
  { Month: "2024-06", Region: "North", Sales: 6700 },
  { Month: "2024-06", Region: "South", Sales: 7200 },
];

const mockData5 = [
  { Product: "Product A", Revenue: 15000, Profit: 4000, Cost: 11000 },
  { Product: "Product B", Revenue: 12000, Profit: 3000, Cost: 9000 },
  { Product: "Product C", Revenue: 18000, Profit: 5000, Cost: 13000 },
  { Product: "Product D", Revenue: 14000, Profit: 3500, Cost: 10500 },
  { Product: "Product E", Revenue: 16000, Profit: 4200, Cost: 11800 },
];

// num_1_cat_1_temp_0  --  mockData1
// num_1_cat_2_temp_0  --  mockData3
// num_1_cat_0_temp_1  --  mockData2
// num_1_cat_1_temp_1  --  mockData4
// num_n_cat_1_temp_0  --  mockData5
const type = "num_1_cat_1_temp_1";
const mockData = mockData4;

const generateGroupedOrStackedAxis = (axis, data, orientation = "v") => {
  const xKey = Object.keys(data[0])[0];
  let yKey;

  if (type === "num_1_cat_2_temp_0" || type === "num_1_cat_1_temp_1") {
    yKey = Object.keys(data[0])[2];
  } else if (type === "num_n_cat_1_temp_0") {
    yKey = undefined;
  }
  if (axis === "x") {
    return orientation === "v" ? xKey : yKey;
  } else if (axis === "y") {
    return orientation === "v" ? yKey : xKey;
  }
};

const generateGroupedOrStackedData = (data, orientation = "v") => {
  if (type === "num_1_cat_2_temp_0" || type === "num_1_cat_1_temp_1") {
    const legendGroupTitle = Object.keys(data[0])[1];
    const cat1 = [...new Set(data.map((item) => Object.values(item)[0]))];
    const cat2 = [...new Set(data.map((item) => Object.values(item)[1]))];

    return cat2.map((cat_2_val, i) => ({
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
      legendgroup: "cat_2",
      showlegend: true,
      ...(i === 0 && { legendgrouptitle: { text: legendGroupTitle } }),
      type: "bar",
      orientation: orientation === "h" ? "h" : undefined,
    }));
  } else if (type === "num_n_cat_1_temp_0") {
    const cat = data.map((item) => Object.values(item)[0]);
    const metrics = Object.keys(data[0]).slice(1);

    return metrics.map((metric) => ({
      [orientation === "v" ? "x" : "y"]: cat,
      [orientation === "v" ? "y" : "x"]: data.map((item) => item[metric]),
      name: metric,
      type: "bar",
      orientation: orientation === "h" ? "h" : undefined,
    }));
  }
};

const BarChart = () => {
  const charts = [];

  if (type === "num_1_cat_1_temp_0" || type === "num_1_cat_0_temp_1") {
    const [xKey, yKey] = Object.keys(mockData[0]);
    const x = mockData.map((item) => Object.values(item)[0]);
    const y = mockData.map((item) => Object.values(item)[1]);

    charts.push({
      title: "Basic Bar Chart",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: [{ x, y, type: "bar" }],
    });

    charts.push({
      title: "Horizontal Basic Bar Chart",
      xAxisTitle: yKey,
      yAxisTitle: xKey,
      data: [{ x: y, y: x, type: "bar", orientation: "h" }],
    });
  } else if (
    type === "num_1_cat_2_temp_0" ||
    type === "num_1_cat_1_temp_1" ||
    type === "num_n_cat_1_temp_0"
  ) {
    charts.push({
      title: "Grouped Bar Chart",
      xAxisTitle: generateGroupedOrStackedAxis("x", mockData, "v"),
      yAxisTitle: generateGroupedOrStackedAxis("y", mockData, "v"),
      data: generateGroupedOrStackedData(mockData, "v"),
      barmode: "group",
    });

    charts.push({
      title: "Stacked Bar Chart",
      xAxisTitle: generateGroupedOrStackedAxis("x", mockData, "v"),
      yAxisTitle: generateGroupedOrStackedAxis("y", mockData, "v"),
      data: generateGroupedOrStackedData(mockData, "v"),
      barmode: "stack",
    });

    charts.push({
      title: "Horizontal Stacked Bar Chart",
      xAxisTitle: generateGroupedOrStackedAxis("x", mockData, "h"),
      yAxisTitle: generateGroupedOrStackedAxis("y", mockData, "h"),
      data: generateGroupedOrStackedData(mockData, "h"),
      barmode: "stack",
    });

    charts.push({
      title: "Horizontal Grouped Bar Chart",
      xAxisTitle: generateGroupedOrStackedAxis("x", mockData, "h"),
      yAxisTitle: generateGroupedOrStackedAxis("y", mockData, "h"),
      data: generateGroupedOrStackedData(mockData, "h"),
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
            xaxis: {
              title: {
                text: chart.xAxisTitle,
              },
            },
            yaxis: {
              title: {
                text: chart.yAxisTitle,
              },
            },
            barmode: chart.barmode,
          }}
        />
      ))}
    </div>
  );
};

export default BarChart;
