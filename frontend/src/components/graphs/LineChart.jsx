import React from "react";
import Plot from "react-plotly.js";
const mockData1 = [
  { Temperature: 4.2, Month: "2025-01-01" },
  { Temperature: 5.0, Month: "2025-02-01" },
  { Temperature: 9.3, Month: "2025-03-01" },
  { Temperature: 14.8, Month: "2025-04-01" },
  { Temperature: 19.6, Month: "2025-05-01" },
  { Temperature: 24.1, Month: "2025-06-01" },
  { Temperature: 27.3, Month: "2025-07-01" },
  { Temperature: 26.8, Month: "2025-08-01" },
  { Temperature: 22.5, Month: "2025-09-01" },
  { Temperature: 16.0, Month: "2025-10-01" },
  { Temperature: 9.4, Month: "2025-11-01" },
  { Temperature: 5.1, Month: "2025-12-01" },
];


const mockData2 = [
  { sales: 230, region: "North", month: "2025-01" },
  { sales: 180, region: "South", month: "2025-01" },
  { sales: 210, region: "East", month: "2025-01" },
  { sales: 250, region: "North", month: "2025-02" },
  { sales: 190, region: "South", month: "2025-02" },
  { sales: 220, region: "East", month: "2025-02" },
  { sales: 270, region: "North", month: "2025-03" },
  { sales: 200, region: "South", month: "2025-03" },
  { sales: 230, region: "East", month: "2025-03" },
];


const mockData3 = [
  { visits: 1200, hospital: "City Hospital", department: "Cardiology", month: "2011-01" },
  { visits: 950, hospital: "Metro Care", department: "Orthopedics", month: "2011-01" },
  { visits: 1100, hospital: "HealthPlus", department: "Pediatrics", month: "2011-01" },
  { visits: 1250, hospital: "City Hospital", department: "Cardiology", month: "2011-02" },
  { visits: 970, hospital: "Metro Care", department: "Orthopedics", month: "2011-02" },
  { visits: 1150, hospital: "HealthPlus", department: "Pediatrics", month: "2011-02" },
];


const mockData4 = [
  { traffic: 12000, revenue: 3500, month: "2024-01" },
  { traffic: 13500, revenue: 3900, month: "2024-02" },
  { traffic: 15000, revenue: 4200, month: "2024-03" },
  { traffic: 16000, revenue: 4500, month: "2024-04" },
  { traffic: 15500, revenue: 4400, month: "2024-05" },
  { traffic: 17000, revenue: 4700, month: "2024-06" },
  { traffic: 18000, revenue: 4900, month: "2024-07" },
  { traffic: 17500, revenue: 4800, month: "2024-08" },
  { traffic: 19000, revenue: 5200, month: "2024-09" },
  { traffic: 20000, revenue: 5500, month: "2024-10" },
  { traffic: 21000, revenue: 5800, month: "2024-11" },
  { traffic: 22000, revenue: 6100, month: "2024-12" },
];


const mockData5 = [
{ Accuracy: 0.55, Epoch: 1 },
{ Accuracy: 0.60, Epoch: 2 },
{ Accuracy: 0.65, Epoch: 3 },
{ Accuracy: 0.69, Epoch: 4 },
{ Accuracy: 0.73, Epoch: 5 },
{ Accuracy: 0.76, Epoch: 6 },
{ Accuracy: 0.78, Epoch: 7 },
{ Accuracy: 0.81, Epoch: 8 },
{ Accuracy: 0.83, Epoch: 9 },
{ Accuracy: 0.85, Epoch: 10 },

];


const mockData6 =  [
  { temperature: 15.2, humidity: 72, date: "2025-01-01" },
  { temperature: 16.8, humidity: 70, date: "2025-02-01" },
  { temperature: 20.3, humidity: 65, date: "2025-03-01" },
  { temperature: 25.6, humidity: 60, date: "2025-04-01" },
  { temperature: 30.1, humidity: 55, date: "2025-05-01" },
  { temperature: 33.7, humidity: 52, date: "2025-06-01" },
  { temperature: 35.2, humidity: 50, date: "2025-07-01" },
  { temperature: 34.8, humidity: 51, date: "2025-08-01" },
  { temperature: 31.0, humidity: 57, date: "2025-09-01" },
  { temperature: 26.4, humidity: 62, date: "2025-10-01" },
  { temperature: 21.1, humidity: 68, date: "2025-11-01" },
  { temperature: 17.5, humidity: 71, date: "2025-12-01" },
];

// num_1_cat_0_temp_1 -- mockData1
// num_1_cat_1_temp_1 -- mockData2
// num_1_cat_2_temp_1 -- mockData3
// num_1_cat_0_temp_0 -- mockData4
// num_1_cat_1_temp_0 -- mockData5
// num_2_cat_0_temp_1 -- mockData6

const type = "num_2_cat_0_temp_1";
const mockData = mockData6;

const colorPalette = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b",
  "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#aec7e8", "#ffbb78",
  "#98df8a", "#ff9896", "#c5b0d5", "#c49c94", "#f7b6d2", "#c7c7c7",
  "#dbdb8d", "#9edae5" 
];

const LineChart = () => {
  let chart = null;
  let yKey2 = null; 

  if (type === "num_1_cat_0_temp_1") {
    const [yKey, xKey] = Object.keys(mockData[0]);
    const x = mockData.map((item) => item[xKey]);
    const y = mockData.map((item) => item[yKey]);

    chart = {
      title: "Simple Univariate Time Series",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: [{ x, y, type: "scatter", mode: "lines+markers", marker: { size: 6 } }],
    };
  } else if (type === "num_1_cat_1_temp_1") {
    const [yKey, catKey, xKey] = Object.keys(mockData[0]);
    const categories = [...new Set(mockData.map((item) => item[catKey]))];
    const dates = [...new Set(mockData.map((item) => item[xKey]))].sort();

    const lineData = categories.map((category, index) => ({
      x: dates.map(date => `${date}-01`),
      y: dates.map((date) => {
        const foundItem = mockData.find(
          (item) => item[xKey] === date && item[catKey] === category
        );
        return foundItem ? foundItem[yKey] : null;
      }),
      type: "scatter",
      mode: "lines+markers",
      name: category,
      line: { color: colorPalette[index % colorPalette.length], width: 2 },
      marker: { size: 6 },
    }));

    chart = {
      title: "Time Series by Category (Grouped Time Series)",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: lineData,
    };
  } else if (type === "num_1_cat_2_temp_1") {
    const [yKey, catKey1, catKey2, xKey] = Object.keys(mockData[0]);
    const categories1 = [...new Set(mockData.map((item) => item[catKey1]))];
    const categories2 = [...new Set(mockData.map((item) => item[catKey2]))];
    const dates = [...new Set(mockData.map((item) => item[xKey]))].sort();

    const lineData = categories1.flatMap((cat1) =>
      categories2.map((cat2, index) => {
        const groupName = `${cat1} - ${cat2}`;
        return {
          x: dates,
          y: dates.map((date) => {
            const foundItem = mockData.find(
              (item) =>
                item[xKey] === date &&
                item[catKey1] === cat1 &&
                item[catKey2] === cat2
            );
            return foundItem ? foundItem[yKey] : null;
          }),
          type: "scatter",
          mode: "lines+markers",
          name: groupName,
          line: { color: colorPalette[index % colorPalette.length], width: 2 },
          marker: { size: 6 },
        };
      })
    );

    const validLineData = lineData.filter((series) =>
      series.y.some((val) => val !== null)
    );

    chart = {
      title: "Multi-Series Categorical Time Trends",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: validLineData,
    };
  } else if (type === "num_2_cat_0_temp_1") {
    const [yKey1, yKey2, xKey] = Object.keys(mockData[0]);
    const x = mockData.map((item) => item[xKey]);
    const y1 = mockData.map((item) => item[yKey1]);
    const y2 = mockData.map((item) => item[yKey2]);

    chart = {
      title: "Dual-Axis Time Series",
      xAxisTitle: xKey,
      yAxisTitle1: yKey1,
      yAxisTitle2: yKey2,
      data: [
        {
          x,
          y: y1,
          type: "scatter",
          mode: "lines+markers",
          name: yKey1,
          line: { color: "#1f77b4", width: 2 },
          marker: { size: 6 },
          yaxis: "y1",
        },
        {
          x,
          y: y2,
          type: "scatter",
          mode: "lines+markers",
          name: yKey2,
          line: { color: "#ff7f0e", dash: "dash", width: 2 },
          marker: { size: 6 },
          yaxis: "y2",
        },
      ],
    };
  } else if (type === "num_1_cat_0_temp_0") {
    const [xKey, yKey] = Object.keys(mockData[0]);
    const x = mockData.map((item) => item[xKey]);
    const y = mockData.map((item) => item[yKey]);

    chart = {
      title: "Sequentially Ordered Numeric (Non-Time)",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: [{ x, y, type: "scatter", mode: "lines+markers", marker: { size: 6 } }],
    };
  } else if (type === "num_1_cat_1_temp_0") {
  const [yKey, xKey] = Object.keys(mockData[0]);

  const x = mockData.map(item => item[xKey]);
  const y = mockData.map(item => item[yKey]);

  const categories = [...new Set(x)];

  chart = {
    title: "Category + Ordered Numeric Sequence",
    xAxisTitle: xKey,
    yAxisTitle: yKey,
    data: [{
      x,
      y,
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#1f77b4", width: 2 },
      marker: { size: 6 },
    }],
  };

}

 

  return (
    <div>
      {chart ? (
        <Plot
          data={chart.data}
          layout={{
            width: 800,
            height: 500,
            title: { text: chart.title, font: { size: 18 } },
            xaxis: {
              title: { text: chart.xAxisTitle, font: { size: 14 } },
              type: type.includes("temp_1") ? "date" : type === "num_1_cat_1_temp_0" ? "category" : "linear",
              tickangle: 45,
              tickfont: { size: 12 },
              automargin: true,
              tickformat: type === "num_2_cat_1_temp_1" ? "%Y" : type === "num_1_cat_1_temp_1" ? "%Y-%m" : undefined,
              range: type === "num_2_cat_1_temp_1" ? [
                new Date("2018-12-01").toISOString(),
                new Date("2023-06-01").toISOString()
              ] : undefined,
            },
            yaxis: {
              title: { text: chart.yAxisTitle || chart.yAxisTitle1, font: { size: 14 } },
              tickfont: { size: 12 },
              range: (type === "num_2_cat_1_temp_1" || type === "num_2_cat_0_temp_1") && chart.yAxisTitle1 ?
                     [0, Math.max(...mockData.map(item => item[chart.yAxisTitle1])) * 1.1] : undefined,
              tickprefix: type === "num_2_cat_1_temp_1" ? "$" : undefined,
            },
            yaxis2: {
              title: { text: chart.yAxisTitle2 || "", font: { size: 14 } },
              tickfont: { size: 12 },
              overlaying: "y",
              side: "right",
              range: (type === "num_2_cat_1_temp_1" || type === "num_2_cat_0_temp_1") && yKey2 ?
                     [0, Math.max(...mockData.map(item => item[yKey2])) * 1.1] : undefined,
            },
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
      ) : (
        <div>No valid chart data available</div>
      )}
    </div>
  );
};

export default LineChart;
