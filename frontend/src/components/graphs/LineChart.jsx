import React from "react";
import Plot from "react-plotly.js";

const type = "num_1_cat_0_temp_1";
//const type = "num_1_cat_1_temp_1"; 


const mockData1 = [
  { "Month": "2025-01-01", "Temperature": 4.2 },
  { "Month": "2025-02-01", "Temperature": 5.0 },
  { "Month": "2025-03-01", "Temperature": 9.3 },
  { "Month": "2025-04-01", "Temperature": 14.8 },
  { "Month": "2025-05-01", "Temperature": 19.6 },
  { "Month": "2025-06-01", "Temperature": 24.1 },
  { "Month": "2025-07-01", "Temperature": 27.3 },
  { "Month": "2025-08-01", "Temperature": 26.8 },
  { "Month": "2025-09-01", "Temperature": 22.5 },
  { "Month": "2025-10-01", "Temperature": 16.0 },
  { "Month": "2025-11-01", "Temperature": 9.4 },
  { "Month": "2025-12-01", "Temperature": 5.1 }
];

const mockData2 = [
  { month: "2025-01", region: "North", sales: 230 },
  { month: "2025-01", region: "South", sales: 180 },
  { month: "2025-01", region: "East", sales: 210 },
  { month: "2025-02", region: "North", sales: 250 },
  { month: "2025-02", region: "South", sales: 190 },
  { month: "2025-02", region: "East", sales: 220 },
  { month: "2025-03", region: "North", sales: 270 },
  { month: "2025-03", region: "South", sales: 200 },
  { month: "2025-03", region: "East", sales: 230 }
];

const LineChart = () => {
  let chart = null;

  if (type === "num_1_cat_0_temp_1") {

    const [xKey, yKey] = Object.keys(mockData1[0]);
    const x = mockData1.map((item) => item[xKey]);
    const y = mockData1.map((item) => item[yKey]);

    chart = {
      title: "Simple Univariate Time Series",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: [{ x, y, type: "scatter", mode: "lines+markers" }],
    };
  } else if (type === "num_1_cat_1_temp_1") {

    const [xKey, catKey, yKey] = Object.keys(mockData2[0]);
    const categories = [...new Set(mockData2.map((item) => item[catKey]))];
    const dates = [...new Set(mockData2.map((item) => item[xKey]))];

    const lineData = categories.map((category) => ({
      x: dates,
      y: dates.map((date) => {
        const foundItem = mockData2.find(
          (item) => item[xKey] === date && item[catKey] === category
        );
        return foundItem ? foundItem[yKey] : 0;
      }),
      type: "scatter",
      mode: "lines+markers",
      name: category,
    }));

    chart = {
      title: "Time Series by Category (Grouped Time Series)",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: lineData,
    };
  }

  return (
    <div>
      {chart && (
        <Plot
          data={chart.data}
          layout={{
            width: 640,
            height: 480,
            title: { text: chart.title },
            xaxis: {
              title: { text: chart.xAxisTitle },
              type: "date",
            },
            yaxis: {
              title: { text: chart.yAxisTitle },
            },
          }}
        />
      )}
    </div>
  );
};

export default LineChart;
