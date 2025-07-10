import React from "react";
import Plot from "react-plotly.js";

const mockData1 = [
  { Month: "2025-01-01", Temperature: 4.2 },
  { Month: "2025-02-01", Temperature: 5.0 },
  { Month: "2025-03-01", Temperature: 9.3 },
  { Month: "2025-04-01", Temperature: 14.8 },
  { Month: "2025-05-01", Temperature: 19.6 },
  { Month: "2025-06-01", Temperature: 24.1 },
  { Month: "2025-07-01", Temperature: 27.3 },
  { Month: "2025-08-01", Temperature: 26.8 },
  { Month: "2025-09-01", Temperature: 22.5 },
  { Month: "2025-10-01", Temperature: 16.0 },
  { Month: "2025-11-01", Temperature: 9.4 },
  { Month: "2025-12-01", Temperature: 5.1 },
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
  { month: "2025-03", region: "East", sales: 230 },
];

const mockData3 = [
  { date: "2024-01-01", temperature: 22.5, humidity: 65 },
  { date: "2024-01-02", temperature: 23.1, humidity: 63 },
  { date: "2024-01-03", temperature: 21.8, humidity: 67 },
  { date: "2024-01-04", temperature: 20.3, humidity: 70 },
  { date: "2024-01-05", temperature: 19.7, humidity: 72 },
];

const mockData4 = [
  { Epoch: 1, Accuracy: 0.55 },
  { Epoch: 2, Accuracy: 0.6 },
  { Epoch: 3, Accuracy: 0.65 },
  { Epoch: 4, Accuracy: 0.69 },
  { Epoch: 5, Accuracy: 0.73 },
  { Epoch: 6, Accuracy: 0.76 },
  { Epoch: 7, Accuracy: 0.78 },
  { Epoch: 8, Accuracy: 0.81 },
  { Epoch: 9, Accuracy: 0.83 },
  { Epoch: 10, Accuracy: 0.85 },
];

const mockData5 = [
  { course: "Mathematics", averageScore: 78 },
  { course: "Physics", averageScore: 72 },
  { course: "Chemistry", averageScore: 75 },
  { course: "Biology", averageScore: 80 },
  { course: "Computer Science", averageScore: 88 },
];

const mockData6 = [
  { step: 1, load: 100 },
  { step: 2, load: 210 },
  { step: 3, load: 320 },
  { step: 4, load: 430 },
  { step: 5, load: 550 },
  { step: 6, load: 670 },
  { step: 7, load: 800 },
  { step: 8, load: 930 },
  { step: 9, load: 1060 },
  { step: 10, load: 1200 },
];

const mockData7 = [
  {
    year: 2019,
    region: "North America",
    avgRevenue: 120000,
    customerCount: 4000,
  },
  { year: 2019, region: "Europe", avgRevenue: 95000, customerCount: 3500 },
  { year: 2019, region: "Asia", avgRevenue: 80000, customerCount: 5000 },

  {
    year: 2020,
    region: "North America",
    avgRevenue: 125000,
    customerCount: 4200,
  },
  { year: 2020, region: "Europe", avgRevenue: 98000, customerCount: 3600 },
  { year: 2020, region: "Asia", avgRevenue: 85000, customerCount: 5300 },

  {
    year: 2021,
    region: "North America",
    avgRevenue: 130000,
    customerCount: 4400,
  },
  { year: 2021, region: "Europe", avgRevenue: 102000, customerCount: 3700 },
  { year: 2021, region: "Asia", avgRevenue: 89000, customerCount: 5500 },

  {
    year: 2022,
    region: "North America",
    avgRevenue: 135000,
    customerCount: 4600,
  },
  { year: 2022, region: "Europe", avgRevenue: 105000, customerCount: 3900 },
  { year: 2022, region: "Asia", avgRevenue: 94000, customerCount: 5700 },

  {
    year: 2023,
    region: "North America",
    avgRevenue: 140000,
    customerCount: 4800,
  },
  { year: 2023, region: "Europe", avgRevenue: 110000, customerCount: 4100 },
  { year: 2023, region: "Asia", avgRevenue: 99000, customerCount: 5900 },
];

// num_1_cat_0_temp_1 --  mockData1
// num_1_cat_1_temp_1_type_1 --  mockData2
// num_1_cat_1_temp_1_type_2 --  mockData2
// num_1_cat_1_temp_1_type_3 --  mockData2
// num_2_cat_0_temp_1 --  mockData3
// num_1_cat_0_temp_0 --  mockData4
// num_1_cat_1_temp_0 --  mockData5
// num_2_cat_0_temp_0 --  mockData6
// num_2_cat_1_temp_1 --  mockData7

const AreaChart = ({ typeString, dataset }) => {
  const type = typeString;
  const mockData = dataset;
  const charts = [];

  if (type === "num_1_cat_0_temp_0") {
    const [xKey, yKey] = Object.keys(mockData[0]);
    charts.push({
      title: "Area Chart for Sequential Data (Non-Time)",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: [
        {
          x: mockData.map((item) => item[xKey]),
          y: mockData.map((item) => item[yKey]),
          type: "scatter",
          mode: "lines",
          fill: "tozeroy",
          line: { shape: "spline", smoothing: 0.2 },
          marker: { size: 6 },
        },
      ],
    });
  } else if (type === "num_1_cat_0_temp_1") {
    const [xKey, yKey] = Object.keys(mockData[0]);
    charts.push({
      title: "Basic Area Simple Univariate Area Series (Cumulative Trend)",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: [
        {
          x: mockData.map((item) => item[xKey]),
          y: mockData.map((item) => item[yKey]),
          type: "scatter",
          mode: "lines",
          fill: "tozeroy",
          line: { shape: "spline" },
        },
      ],
    });
  } else if (type === "num_1_cat_1_temp_0") {
    const [xKey, yKey] = Object.keys(mockData[0]);
    charts.push({
      title: "Area Chart: Average Score by Course",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: [
        {
          x: mockData.map((item) => item[xKey]),
          y: mockData.map((item) => item[yKey]),
          type: "scatter",
          mode: "lines",
          fill: "tozeroy",
          line: { shape: "spline" },
          marker: { size: 8 },
          name: yKey,
        },
      ],
    });
  } else if (type === "num_1_cat_1_temp_1_type_1") {
    const [xKey, catKey, yKey] = Object.keys(mockData[0]);
    const categories = [...new Set(mockData.map((item) => item[catKey]))];
    const dates = [...new Set(mockData.map((item) => item[xKey]))];
    const totals = dates.map((date) => {
      const items = mockData.filter((item) => item[xKey] === date);
      return items.reduce((sum, item) => sum + item[yKey], 0);
    });
    charts.push({
      title: "Stacked Area Chart (Category Comparison Over Time)",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: categories.map((category) => ({
        x: dates,
        y: dates.map((date) => {
          const foundItem = mockData.find(
            (item) => item[xKey] === date && item[catKey] === category
          );
          return foundItem ? foundItem[yKey] : 0;
        }),
        name: category,
        type: "scatter",
        mode: "lines",
        fill: "tonexty",
        line: { shape: "spline" },
      })),
    });
    charts.push({
      title: "100% Stacked Area Chart (Proportional Composition Over Time)",
      xAxisTitle: xKey,
      yAxisTitle: "Percentage Share (%)",
      data: categories.map((category) => ({
        x: dates,
        y: dates.map((date, idx) => {
          const foundItem = mockData.find(
            (item) => item[xKey] === date && item[catKey] === category
          );
          const value = foundItem ? foundItem[yKey] : 0;
          return totals[idx] > 0 ? (value / totals[idx]) * 100 : 0;
        }),
        name: category,
        type: "scatter",
        mode: "lines",
        fill: "tonexty",
        line: { shape: "spline" },
      })),
    });
    charts.push({
      title: "Multi-Series Area Chart (Overlapping Trends)",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: categories.map((category) => ({
        x: dates,
        y: dates.map((date) => {
          const foundItem = mockData.find(
            (item) => item[xKey] === date && item[catKey] === category
          );
          return foundItem ? foundItem[yKey] : 0;
        }),
        name: category,
        type: "scatter",
        mode: "lines",
        fill: "tozeroy",
        opacity: 0.4,
        line: { shape: "spline" },
      })),
    });
  } else if (type === "num_2_cat_0_temp_1") {
    const [xKey, y1Key, y2Key] = Object.keys(mockData[0]);
    charts.push({
      title: "Dual-Axis Area Chart",
      xAxisTitle: xKey,
      yAxisTitle: y1Key,
      yAxis2Title: y2Key,
      data: [
        {
          x: mockData.map((item) => item[xKey]),
          y: mockData.map((item) => item[y1Key]),
          name: y1Key,
          type: "scatter",
          mode: "lines",
          fill: "tozeroy",
          opacity: 0.5,
          line: { shape: "spline" },
          yaxis: "y1",
        },
        {
          x: mockData.map((item) => item[xKey]),
          y: mockData.map((item) => item[y2Key]),
          name: y2Key,
          type: "scatter",
          mode: "lines",
          fill: "tozeroy",
          opacity: 0.5,
          line: { shape: "spline" },
          yaxis: "y2",
        },
      ],
    });
  } else if (type === "num_2_cat_0_temp_0") {
    const [xKey, y1Key] = Object.keys(mockData[0]);
    charts.push({
      title: "Numeric Sequence Area Chart",
      xAxisTitle: xKey,
      yAxisTitle: y1Key,
      data: [
        {
          x: mockData.map((item) => item[xKey]),
          y: mockData.map((item) => item[y1Key]),
          type: "scatter",
          mode: "lines",
          fill: "tozeroy",
          line: { shape: "spline" },
          marker: { size: 6 },
        },
      ],
    });
  } else if (type === "num_2_cat_1_temp_1") {
    const [xKey, catKey, y1Key, y2Key] = Object.keys(mockData[0]);
    const categories = [...new Set(mockData.map((item) => item[catKey]))];
    const years = [...new Set(mockData.map((item) => item[xKey]))];
    charts.push({
      title: "Time + Aggregation + Category (Stacked/Grouped)",
      xAxisTitle: xKey,
      yAxisTitle: `${y1Key} / ${y2Key}`,
      data: [
        ...categories.map((region) => ({
          x: years,
          y: years.map(
            (year) =>
              (mockData.find(
                (item) => item[xKey] === year && item[catKey] === region
              ) || {})[y1Key] || 0
          ),
          name: `${region} - ${y1Key}`,
          type: "scatter",
          mode: "lines",
          fill: "tozeroy",
          opacity: 0.6,
          line: { shape: "spline" },
        })),
        ...categories.map((region) => ({
          x: years,
          y: years.map(
            (year) =>
              (mockData.find(
                (item) => item[xKey] === year && item[catKey] === region
              ) || {})[y2Key] || 0
          ),
          name: `${region} - ${y2Key}`,
          type: "scatter",
          mode: "lines",
          fill: "tozeroy",
          opacity: 0.3,
          line: { shape: "spline", dash: "dot" },
        })),
      ],
    });
  }

  return (
    <div>
      {charts.length > 0 ? (
        charts.map((chart, idx) => (
          <Plot
            key={idx}
            data={chart.data}
            layout={{
              width: 800,
              height: 500,
              title: { text: chart.title, font: { size: 18 } },
              xaxis: {
                title: { text: chart.xAxisTitle, font: { size: 14 } },
                type:
                  type === "num_1_cat_1_temp_0"
                    ? "category"
                    : type.includes("temp_1")
                    ? "date"
                    : "linear",
                tickangle: 45,
                tickfont: { size: 12 },
                automargin: true,
              },
              yaxis: {
                title: { text: chart.yAxisTitle, font: { size: 14 } },
                tickfont: { size: 12 },
                ...(type === "num_1_cat_1_temp_1_type_2"
                  ? { range: [0, 100], ticksuffix: "%" }
                  : {}),
              },
              ...(chart.yAxis2Title
                ? {
                    yaxis2: {
                      title: { text: chart.yAxis2Title, font: { size: 14 } },
                      overlaying: "y",
                      side: "right",
                      tickfont: { size: 12 },
                    },
                  }
                : {}),
              legend: {
                x: 1.05,
                y: 1,
                xanchor: "left",
                yanchor: "top",
                font: { size: 10 },
                bgcolor: "rgba(255, 255, 255, 0.8)",
                bordercolor: "#000",
                borderwidth: 1,
              },
              margin: { l: 60, r: 60, t: 60, b: 80 },
              showlegend: true,
              hovermode: "x unified",
            }}
          />
        ))
      ) : (
        <div>No valid chart data available</div>
      )}
    </div>
  );
};

export default AreaChart;