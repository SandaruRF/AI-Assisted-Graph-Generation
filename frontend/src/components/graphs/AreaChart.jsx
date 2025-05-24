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
  { Temperature: 5.1, Month: "2025-12-01" }
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
  { sales: 230, region: "East", month: "2025-03" }
];

const mockData3 = [
  { temperature: 22.5, humidity: 65, date: "2024-01-01" },
  { temperature: 23.1, humidity: 63, date: "2024-01-02" },
  { temperature: 21.8, humidity: 67, date: "2024-01-03" },
  { temperature: 20.3, humidity: 70, date: "2024-01-04" },
  { temperature: 19.7, humidity: 72, date: "2024-01-05" }
];

const mockData4 = [
  { Epoch: 1, Accuracy: 0.55 },
  { Epoch: 2, Accuracy: 0.60 },
  { Epoch: 3, Accuracy: 0.65 },
  { Epoch: 4, Accuracy: 0.69 },
  { Epoch: 5, Accuracy: 0.73 },
  { Epoch: 6, Accuracy: 0.76 },
  { Epoch: 7, Accuracy: 0.78 },
  { Epoch: 8, Accuracy: 0.81 },
  { Epoch: 9, Accuracy: 0.83 },
  { Epoch: 10, Accuracy: 0.85 }
];

const mockData5 = [
  { averageScore: 78, course: "Mathematics" },
  { averageScore: 72, course: "Physics" },
  { averageScore: 75, course: "Chemistry" },
  { averageScore: 80, course: "Biology" },
  { averageScore: 88, course: "Computer Science" }
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
  { step: 10, load: 1200 }
];

const mockData7 = [
  { avgProfit: 45000, unitsSold: 1200, market: "North America", fiscalYear: 2019 },
  { avgProfit: 38000, unitsSold: 1100, market: "Europe", fiscalYear: 2019 },
  { avgProfit: 31000, unitsSold: 1600, market: "Asia", fiscalYear: 2019 },

  { avgProfit: 47000, unitsSold: 1250, market: "North America", fiscalYear: 2020 },
  { avgProfit: 40000, unitsSold: 1150, market: "Europe", fiscalYear: 2020 },
  { avgProfit: 33500, unitsSold: 1700, market: "Asia", fiscalYear: 2020 },

  { avgProfit: 49500, unitsSold: 1300, market: "North America", fiscalYear: 2021 },
  { avgProfit: 42000, unitsSold: 1180, market: "Europe", fiscalYear: 2021 },
  { avgProfit: 36000, unitsSold: 1800, market: "Asia", fiscalYear: 2021 },

  { avgProfit: 52000, unitsSold: 1380, market: "North America", fiscalYear: 2022 },
  { avgProfit: 44500, unitsSold: 1220, market: "Europe", fiscalYear: 2022 },
  { avgProfit: 39000, unitsSold: 1900, market: "Asia", fiscalYear: 2022 },

  { avgProfit: 55000, unitsSold: 1450, market: "North America", fiscalYear: 2023 },
  { avgProfit: 47000, unitsSold: 1250, market: "Europe", fiscalYear: 2023 },
  { avgProfit: 41500, unitsSold: 2000, market: "Asia", fiscalYear: 2023 }
];




// Type and mock data mapping
// num_1_cat_0_temp_1 -- mockData1
// num_1_cat_1_temp_1 -- mockData2
// num_1_cat_1_temp_1 -- mockData2
// num_1_cat_1_temp_1 -- mockData2
// num_2_cat_0_temp_1 -- mockData3
// num_1_cat_0_temp_0 -- mockData4
// num_1_cat_1_temp_0 -- mockData5
// num_2_cat_0_temp_0 -- mockData6
// num_2_cat_1_temp_1 -- mockData7

const type = "num_2_cat_1_temp_1"; 
const mockData = mockData7; 

const AreaChart = () => {
  const charts = [];

  if (type === "num_1_cat_0_temp_0") {
    const [xKey, yKey] = Object.keys(mockData[0]);
    charts.push({
      title: "Area Chart for Sequential Data (Non-Time)",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: [{
        x: mockData.map((item) => item[xKey]),
        y: mockData.map((item) => item[yKey]),
        type: "scatter",
        mode: "lines+markers",
        fill: "tozeroy",
        line: { shape: "spline", smoothing: 0.2 },
        marker: { size: 6 }
      }]
    });
  }

  else if (type === "num_1_cat_0_temp_1") {
    const [yKey, xKey] = Object.keys(mockData[0]); 
    let cumulativeSum = 0;
    const cumulativeY = mockData.map(item => {
      cumulativeSum += item[yKey];
      return cumulativeSum;
    });
    charts.push({
      title: "Cumulative Area Chart (Univariate Temporal)",
      xAxisTitle: xKey,
      yAxisTitle: `Cumulative ${yKey}`,
      data: [{
        x: mockData.map(item => item[xKey]),
        y: cumulativeY,
        type: "scatter",
        mode: "lines+markers",
        fill: "tozeroy",
        line: { shape: "spline", color: "#1f77b4" },
        marker: { size: 6 }
      }]
    });
  }

  else if (type === "num_1_cat_1_temp_0") {
    const [yKey, xKey] = Object.keys(mockData[0]); 
    charts.push({
      title: "Area Chart: Numeric by Category",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: [{
        x: mockData.map(item => item[xKey]),
        y: mockData.map(item => item[yKey]),
        type: "scatter",
        mode: "lines+markers",
        fill: "tozeroy",
        line: { shape: "spline", color: "#1f77b4" },
        marker: { size: 8 },
        name: yKey
      }]
    });
  }

  else if (type === "num_1_cat_1_temp_1") {
    const [yKey, catKey, xKey] = Object.keys(mockData[0]); 
    const categories = [...new Set(mockData.map(item => item[catKey]))];
    const dates = [...new Set(mockData.map(item => item[xKey]))];
    charts.push({
      title: "Stacked Area Chart (Category Comparison Over Time)",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: categories.map(category => ({
        x: dates,
        y: dates.map(date => {
          const foundItem = mockData.find(item => item[xKey] === date && item[catKey] === category);
          return foundItem ? foundItem[yKey] : 0;
        }),
        name: category,
        type: "scatter",
        mode: "lines",
        fill: "tonexty",
        line: { shape: "spline" }
      }))
    });
  }

  else if (type === "num_1_cat_1_temp_1") {
    const [yKey, catKey, xKey] = Object.keys(mockData[0]);
    const categories = [...new Set(mockData.map(item => item[catKey]))];
    const dates = [...new Set(mockData.map(item => item[xKey]))];
    const totals = dates.map(date => {
      const items = mockData.filter(item => item[xKey] === date);
      return items.reduce((sum, item) => sum + item[yKey], 0);
    });
    charts.push({
      title: "100% Stacked Area Chart (Proportional Composition)",
      xAxisTitle: xKey,
      yAxisTitle: "Percentage Share (%)",
      data: categories.map(category => ({
        x: dates,
        y: dates.map((date, idx) => {
          const foundItem = mockData.find(item => item[xKey] === date && item[catKey] === category);
          const value = foundItem ? foundItem[yKey] : 0;
          return totals[idx] > 0 ? (value / totals[idx]) * 100 : 0;
        }),
        name: category,
        type: "scatter",
        mode: "lines",
        fill: "tonexty",
        line: { shape: "spline" }
      }))
    });
  }

  else if (type === "num_1_cat_1_temp_1_type") {
    const [yKey, catKey, xKey] = Object.keys(mockData[0]);
    const categories = [...new Set(mockData.map(item => item[catKey]))];
    const dates = [...new Set(mockData.map(item => item[xKey]))];
    charts.push({
      title: "Multi-Series Area Chart (Overlapping Trends)",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: categories.map(category => ({
        x: dates,
        y: dates.map(date => {
          const foundItem = mockData.find(item => item[xKey] === date && item[catKey] === category);
          return foundItem ? foundItem[yKey] : 0;
        }),
        name: category,
        type: "scatter",
        mode: "lines",
        fill: "tozeroy",
        opacity: 0.4,
        line: { shape: "spline" }
      }))
    });
  }

  else if (type === "num_2_cat_0_temp_1") {
    const [y1Key, y2Key, xKey] = Object.keys(mockData[0]);
    charts.push({
      title: "Dual-Axis Area Chart",
      xAxisTitle: xKey,
      yAxisTitle: y1Key,
      yAxis2Title: y2Key,
      data: [
        {
          x: mockData.map(item => item[xKey]),
          y: mockData.map(item => item[y1Key]),
          name: y1Key,
          type: "scatter",
          mode: "lines+markers",
          fill: "tozeroy",
          opacity: 0.5,
          line: { shape: "spline", color: "#1f77b4" },
          yaxis: "y1"
        },
        {
          x: mockData.map(item => item[xKey]),
          y: mockData.map(item => item[y2Key]),
          name: y2Key,
          type: "scatter",
          mode: "lines+markers",
          fill: "tozeroy",
          opacity: 0.5,
          line: { shape: "spline", color: "#ff7f0e" },
          yaxis: "y2"
        }
      ]
    });
  }

  else if (type === "num_2_cat_0_temp_0") {
    const [xKey, y1Key] = Object.keys(mockData[0]);
    charts.push({
      title: "Numeric Sequence Area Chart",
      xAxisTitle: xKey,
      yAxisTitle: y1Key,
      data: [{
        x: mockData.map(item => item[xKey]),
        y: mockData.map(item => item[y1Key]),
        type: "scatter",
        mode: "lines+markers",
        fill: "tozeroy",
        line: { shape: "spline", color: "#1f77b4" },
        marker: { size: 6 }
      }]
    });
  }

  else if (type === "num_2_cat_1_temp_1") {
    const [y1Key, y2Key, catKey, xKey] = Object.keys(mockData[0]); 
    const categories = [...new Set(mockData.map(item => item[catKey]))]; 
    const years = [...new Set(mockData.map(item => item[xKey]))].sort(); 
    const formattedYears = years.map(year => `${year}-01-01`);
    charts.push({
      title: "Dual-Axis Area Chart: Profit and Units Sold by Market Over Time",
      xAxisTitle: xKey,
      yAxisTitle: y1Key,
      yAxis2Title: y2Key,
      data: [
        ...categories.map((region, index) => ({
          x: formattedYears, 
          y: years.map(year =>
            (mockData.find(item => item[xKey] === year && item[catKey] === region) || {})[y1Key] || 0
          ),
          name: `${region} - ${y1Key}`,
          type: "scatter",
          mode: "lines",
          fill: "tonexty", 
          line: { shape: "spline", color: ["#1f77b4", "#ff7f0e", "#2ca02c"][index % 3], width: 2 },
          yaxis: "y1"
        })),
        ...categories.map((region, index) => ({
          x: formattedYears, 
          y: years.map(year =>
            (mockData.find(item => item[xKey] === year && item[catKey] === region) || {})[y2Key] || 0
          ),
          name: `${region} - ${y2Key}`,
          type: "scatter",
          mode: "lines+markers",
          fill: "tozeroy", 
          opacity: 0.5,
          line: { 
            shape: "spline", 
            color: ["#1f77b4", "#ff7f0e", "#2ca02c"][index % 3], 
            dash: "dash", 
            width: 2 
          },
          marker: { size: 8 },
          yaxis: "y2"
        }))
      ]
    });
  }
  
  return (
    <div>
      {charts.length > 0 ? charts.map((chart, idx) => (
        <Plot
          key={idx}
          data={chart.data}
          layout={{
            width: 800,
            height: 500,
            title: { text: chart.title, font: { size: 18 } },
            xaxis: {
              title: { text: chart.xAxisTitle, font: { size: 14 } },
              type: type === "num_1_cat_1_temp_0" ? "category" : 
                    type.includes("temp_1") ? "date" : "linear",
              tickangle: 45,
              tickfont: { size: 12 },
              automargin: true,
            },
            yaxis: {
              title: { text: chart.yAxisTitle, font: { size: 14 } },
              tickfont: { size: 12 },
              ...(type === "num_1_cat_1_temp_1" 
                ? { range: [0, 100], ticksuffix: "%" } 
                : {}),
            },
            ...(chart.yAxis2Title ? {
              yaxis2: {
                title: { text: chart.yAxis2Title, font: { size: 14 } },
                overlaying: "y",
                side: "right",
                tickfont: { size: 12 },
              }
            } : {}),
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
      )) : (
        <div>No valid chart data available</div>
      )}
    </div>
  );
};

export default AreaChart;