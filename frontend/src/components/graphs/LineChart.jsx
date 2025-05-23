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
  {
    month: "2011-01",
    hospital: "City Hospital",
    department: "Cardiology",
    visits: 1200,
  },
  {
    month: "2011-01",
    hospital: "Metro Care",
    department: "Orthopedics",
    visits: 950,
  },
  {
    month: "2011-01",
    hospital: "HealthPlus",
    department: "Pediatrics",
    visits: 1100,
  },
  {
    month: "2011-02",
    hospital: "City Hospital",
    department: "Cardiology",
    visits: 1250,
  },
  {
    month: "2011-02",
    hospital: "Metro Care",
    department: "Orthopedics",
    visits: 970,
  },
  {
    month: "2011-02",
    hospital: "HealthPlus",
    department: "Pediatrics",
    visits: 1150,
  },
];

const mockData4 = [
  { month: "2024-01", traffic: 12000, revenue: 3500 },
  { month: "2024-02", traffic: 13500, revenue: 3900 },
  { month: "2024-03", traffic: 15000, revenue: 4200 },
  { month: "2024-04", traffic: 16000, revenue: 4500 },
  { month: "2024-05", traffic: 15500, revenue: 4400 },
  { month: "2024-06", traffic: 17000, revenue: 4700 },
  { month: "2024-07", traffic: 18000, revenue: 4900 },
  { month: "2024-08", traffic: 17500, revenue: 4800 },
  { month: "2024-09", traffic: 19000, revenue: 5200 },
  { month: "2024-10", traffic: 20000, revenue: 5500 },
  { month: "2024-11", traffic: 21000, revenue: 5800 },
  { month: "2024-12", traffic: 22000, revenue: 6100 },
];

const mockData5 = [
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

const mockData6 = [
  { education: "High School", satisfaction_score: 65 },
  { education: "Associate Degree", satisfaction_score: 70 },
  { education: "Bachelor's", satisfaction_score: 78 },
  { education: "Master's", satisfaction_score: 82 },
  { education: "PhD", satisfaction_score: 88 },
];

const mockData7 = [
  {
    month: "2025-01",
    region: "North America",
    visits: 12000,
    conversions: 480,
  },
  { month: "2025-01", region: "Europe", visits: 9500, conversions: 380 },
  { month: "2025-01", region: "Asia", visits: 15000, conversions: 510 },
  {
    month: "2025-02",
    region: "North America",
    visits: 13000,
    conversions: 520,
  },
  { month: "2025-02", region: "Europe", visits: 9700, conversions: 390 },
  { month: "2025-02", region: "Asia", visits: 15800, conversions: 540 },
  {
    month: "2025-03",
    region: "North America",
    visits: 12500,
    conversions: 510,
  },
  { month: "2025-03", region: "Europe", visits: 9400, conversions: 370 },
  { month: "2025-03", region: "Asia", visits: 16200, conversions: 560 },
  {
    month: "2025-04",
    region: "North America",
    visits: 13500,
    conversions: 550,
  },
  { month: "2025-04", region: "Europe", visits: 9900, conversions: 400 },
  { month: "2025-04", region: "Asia", visits: 17000, conversions: 590 },
];

// num_1_cat_0_temp_1 --  mockData1
// num_1_cat_1_temp_1 --  mockData2
// num_1_cat_2_temp_1 --  mockData3
// num_2_cat_0_temp_1 --  mockData4
// num_1_cat_0_temp_0 --  mockData5
// num_1_cat_1_temp_0 --  mockData6
// num_2_cat_1_temp_1 --  mockData7



const LineChart = ({ typeString, dataset, colors, xLabel, yLabel, legendLabels }) => {
  const type = typeString;
  const mockData = dataset;

  const getLegendName = (name) => legendLabels?.[name] || name;
  const getColor = (index) => (colors && colors[index]) || undefined;

  let chart = null;

  if (type === "num_1_cat_0_temp_1") {
    const [xKey, yKey] = Object.keys(mockData[0]);
    const x = mockData.map(item => item[xKey]);
    const y = mockData.map(item => item[yKey]);

    chart = {
      title: "Simple Univariate Time Series",
      xAxisTitle: xLabel || xKey,
      yAxisTitle: yLabel || yKey,
      data: [
        {
          x, y,
          type: "scatter",
          mode: "lines+markers",
          marker: { size: 6, color: getColor(0) }
        }
      ],
    };
  }

  else if (type === "num_1_cat_1_temp_1") {
    const [xKey, catKey, yKey] = Object.keys(mockData[0]);
    const categories = [...new Set(mockData.map(item => item[catKey]))];
    const dates = [...new Set(mockData.map(item => item[xKey]))];

    const lineData = categories.map((category, i) => ({
      x: dates,
      y: dates.map(date => {
        const item = mockData.find(d => d[xKey] === date && d[catKey] === category);
        return item ? item[yKey] : null;
      }),
      type: "scatter",
      mode: "lines+markers",
      name: getLegendName(category),
      marker: { size: 6, color: getColor(i) },
    }));

    chart = {
      title: "Time Series by Category",
      xAxisTitle: xLabel || xKey,
      yAxisTitle: yLabel || yKey,
      data: lineData,
    };
  }

  else if (type === "num_1_cat_2_temp_1") {
    const [xKey, catKey1, catKey2, yKey] = Object.keys(mockData[0]);
    const cat1s = [...new Set(mockData.map(item => item[catKey1]))];
    const cat2s = [...new Set(mockData.map(item => item[catKey2]))];
    const dates = [...new Set(mockData.map(item => item[xKey]))];

    const lineData = cat1s.flatMap((cat1, i) =>
      cat2s.map((cat2, j) => {
        const groupName = `${getLegendName(cat1)} - ${getLegendName(cat2)}`;
        return {
          x: dates,
          y: dates.map(date => {
            const item = mockData.find(
              d => d[xKey] === date && d[catKey1] === cat1 && d[catKey2] === cat2
            );
            return item ? item[yKey] : null;
          }),
          name: groupName,
          type: "scatter",
          mode: "lines+markers",
          marker: { size: 6, color: getColor(i * cat2s.length + j) },
        };
      })
    ).filter(series => series.y.some(val => val !== null));

    chart = {
      title: "Multi-Series Categorical Trends",
      xAxisTitle: xLabel || xKey,
      yAxisTitle: yLabel || yKey,
      data: lineData,
    };
  }

  else if (type === "num_2_cat_0_temp_1") {
    const [xKey, yKey1, yKey2] = Object.keys(mockData[0]);
    const x = mockData.map(item => item[xKey]);

    chart = {
      title: "Dual-Axis Time Series",
      xAxisTitle: xLabel || xKey,
      yAxisTitle1: getLegendName(yKey1),
      yAxisTitle2: getLegendName(yKey2),
      data: [
        {
          x, y: mockData.map(item => item[yKey1]),
          type: "scatter",
          mode: "lines+markers",
          name: getLegendName(yKey1),
          yaxis: "y1",
          marker: { size: 6, color: getColor(0) },
        },
        {
          x, y: mockData.map(item => item[yKey2]),
          type: "scatter",
          mode: "lines+markers",
          name: getLegendName(yKey2),
          yaxis: "y2",
          marker: { size: 6, color: getColor(1) },
        },
      ],
    };
  }

  else if (type === "num_1_cat_0_temp_0" || type === "num_1_cat_1_temp_0") {
    const [xKey, yKey] = Object.keys(mockData[0]);
    const x = mockData.map(item => item[xKey]);
    const y = mockData.map(item => item[yKey]);

    chart = {
      title: "Sequential Line Chart",
      xAxisTitle: xLabel || xKey,
      yAxisTitle: yLabel || yKey,
      data: [
        {
          x, y,
          type: "scatter",
          mode: "lines+markers",
          marker: { size: 6, color: getColor(0) }
        },
      ],
    };
  }

  else if (type === "num_2_cat_1_temp_1") {
    const [xKey, catKey, yKey1, yKey2] = Object.keys(mockData[0]);
    const categories = [...new Set(mockData.map(item => item[catKey]))];
    const dates = [...new Set(mockData.map(item => item[xKey]))];

    const lineData = categories.flatMap((cat, i) => [
      {
        x: dates,
        y: dates.map(date => {
          const item = mockData.find(d => d[xKey] === date && d[catKey] === cat);
          return item ? item[yKey1] : null;
        }),
        name: `${getLegendName(cat)} - ${getLegendName(yKey1)}`,
        type: "scatter",
        mode: "lines+markers",
        yaxis: "y1",
        marker: { size: 6, color: getColor(i * 2) },
      },
      {
        x: dates,
        y: dates.map(date => {
          const item = mockData.find(d => d[xKey] === date && d[catKey] === cat);
          return item ? item[yKey2] : null;
        }),
        name: `${getLegendName(cat)} - ${getLegendName(yKey2)}`,
        type: "scatter",
        mode: "lines+markers",
        yaxis: "y2",
        marker: { size: 6, color: getColor(i * 2 + 1) },
      },
    ]);

    chart = {
      title: "Grouped Dual-Metric Time Series",
      xAxisTitle: xLabel || xKey,
      yAxisTitle1: getLegendName(yKey1),
      yAxisTitle2: getLegendName(yKey2),
      data: lineData,
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
              type: type.includes("temp_1") ? "date" : "category",
              tickangle: 45,
              tickfont: { size: 12 },
              automargin: true,
            },
            yaxis: {
              title: {
                text: chart.yAxisTitle || chart.yAxisTitle1,
                font: { size: 14 },
              },
              tickfont: { size: 12 },
            },
            yaxis2: chart.yAxisTitle2
              ? {
                  title: { text: chart.yAxisTitle2, font: { size: 14 } },
                  overlaying: "y",
                  side: "right",
                  tickfont: { size: 12 },
                }
              : undefined,
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
