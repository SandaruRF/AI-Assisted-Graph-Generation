import React from "react";
import Plot from "react-plotly.js";

const mockData1 = [
  { NumberOfAlbumsSold: 22, SaleMonth: "2021-01" },
  { NumberOfAlbumsSold: 16, SaleMonth: "2021-02" },
  { NumberOfAlbumsSold: 17, SaleMonth: "2021-03" },
  { NumberOfAlbumsSold: 20, SaleMonth: "2021-04" },
  { NumberOfAlbumsSold: 17, SaleMonth: "2021-05" },
  { NumberOfAlbumsSold: 21, SaleMonth: "2021-06" },
  { NumberOfAlbumsSold: 20, SaleMonth: "2021-07" },
  { NumberOfAlbumsSold: 20, SaleMonth: "2021-08" },
  { NumberOfAlbumsSold: 18, SaleMonth: "2021-09" },
  { NumberOfAlbumsSold: 21, SaleMonth: "2021-10" },
  { NumberOfAlbumsSold: 17, SaleMonth: "2021-11" },
  { NumberOfAlbumsSold: 19, SaleMonth: "2021-12" },
  { NumberOfAlbumsSold: 14, SaleMonth: "2022-01" },
  { NumberOfAlbumsSold: 17, SaleMonth: "2022-02" },
  { NumberOfAlbumsSold: 20, SaleMonth: "2022-03" },
  { NumberOfAlbumsSold: 27, SaleMonth: "2022-04" },
  { NumberOfAlbumsSold: 17, SaleMonth: "2022-05" },
  { NumberOfAlbumsSold: 17, SaleMonth: "2022-06" },
  { NumberOfAlbumsSold: 20, SaleMonth: "2022-07" },
  { NumberOfAlbumsSold: 18, SaleMonth: "2022-08" },
  { NumberOfAlbumsSold: 20, SaleMonth: "2022-09" },
  { NumberOfAlbumsSold: 19, SaleMonth: "2022-10" },
  { NumberOfAlbumsSold: 20, SaleMonth: "2022-11" },
  { NumberOfAlbumsSold: 18, SaleMonth: "2022-12" },
  { NumberOfAlbumsSold: 19, SaleMonth: "2023-01" },
  { NumberOfAlbumsSold: 18, SaleMonth: "2023-02" },
  { NumberOfAlbumsSold: 18, SaleMonth: "2023-03" },
  { NumberOfAlbumsSold: 13, SaleMonth: "2023-04" },
  { NumberOfAlbumsSold: 16, SaleMonth: "2023-05" },
  { NumberOfAlbumsSold: 19, SaleMonth: "2023-06" },
  { NumberOfAlbumsSold: 23, SaleMonth: "2023-07" },
  { NumberOfAlbumsSold: 15, SaleMonth: "2023-08" },
  { NumberOfAlbumsSold: 17, SaleMonth: "2023-09" },
  { NumberOfAlbumsSold: 19, SaleMonth: "2023-10" },
  { NumberOfAlbumsSold: 7, SaleMonth: "2023-11" },
  { NumberOfAlbumsSold: 17, SaleMonth: "2023-12" },
  { NumberOfAlbumsSold: 21, SaleMonth: "2024-01" },
  { NumberOfAlbumsSold: 22, SaleMonth: "2024-02" },
  { NumberOfAlbumsSold: 17, SaleMonth: "2024-03" },
  { NumberOfAlbumsSold: 17, SaleMonth: "2024-04" },
  { NumberOfAlbumsSold: 18, SaleMonth: "2024-05" },
  { NumberOfAlbumsSold: 19, SaleMonth: "2024-06" },
  { NumberOfAlbumsSold: 16, SaleMonth: "2024-07" },
  { NumberOfAlbumsSold: 16, SaleMonth: "2024-08" },
  { NumberOfAlbumsSold: 12, SaleMonth: "2024-09" },
  { NumberOfAlbumsSold: 27, SaleMonth: "2024-10" },
  { NumberOfAlbumsSold: 23, SaleMonth: "2024-11" },
  { NumberOfAlbumsSold: 16, SaleMonth: "2024-12" },
  { NumberOfAlbumsSold: 16, SaleMonth: "2025-01" },
  { NumberOfAlbumsSold: 16, SaleMonth: "2025-02" },
  { NumberOfAlbumsSold: 17, SaleMonth: "2025-03" },
  { NumberOfAlbumsSold: 20, SaleMonth: "2025-04" },
  { NumberOfAlbumsSold: 22, SaleMonth: "2025-05" },
  { NumberOfAlbumsSold: 20, SaleMonth: "2025-06" },
  { NumberOfAlbumsSold: 20, SaleMonth: "2025-07" },
  { NumberOfAlbumsSold: 18, SaleMonth: "2025-08" },
  { NumberOfAlbumsSold: 19, SaleMonth: "2025-09" },
  { NumberOfAlbumsSold: 19, SaleMonth: "2025-10" },
  { NumberOfAlbumsSold: 14, SaleMonth: "2025-11" },
  { NumberOfAlbumsSold: 18, SaleMonth: "2025-12" },
];

// const mockData2 = [
//   { month: "2025-01", region: "North", sales: 230 },
//   { month: "2025-01", region: "South", sales: 180 },
//   { month: "2025-01", region: "East", sales: 210 },
//   { month: "2025-02", region: "North", sales: 250 },
//   { month: "2025-02", region: "South", sales: 190 },
//   { month: "2025-02", region: "East", sales: 220 },
//   { month: "2025-03", region: "North", sales: 270 },
//   { month: "2025-03", region: "South", sales: 200 },
//   { month: "2025-03", region: "East", sales: 230 },
// ];

// const mockData3 = [
//   {
//     month: "2011-01",
//     hospital: "City Hospital",
//     department: "Cardiology",
//     visits: 1200,
//   },
//   {
//     month: "2011-01",
//     hospital: "Metro Care",
//     department: "Orthopedics",
//     visits: 950,
//   },
//   {
//     month: "2011-01",
//     hospital: "HealthPlus",
//     department: "Pediatrics",
//     visits: 1100,
//   },
//   {
//     month: "2011-02",
//     hospital: "City Hospital",
//     department: "Cardiology",
//     visits: 1250,
//   },
//   {
//     month: "2011-02",
//     hospital: "Metro Care",
//     department: "Orthopedics",
//     visits: 970,
//   },
//   {
//     month: "2011-02",
//     hospital: "HealthPlus",
//     department: "Pediatrics",
//     visits: 1150,
//   },
// ];

// const mockData4 = [
//   { month: "2024-01", traffic: 12000, revenue: 3500 },
//   { month: "2024-02", traffic: 13500, revenue: 3900 },
//   { month: "2024-03", traffic: 15000, revenue: 4200 },
//   { month: "2024-04", traffic: 16000, revenue: 4500 },
//   { month: "2024-05", traffic: 15500, revenue: 4400 },
//   { month: "2024-06", traffic: 17000, revenue: 4700 },
//   { month: "2024-07", traffic: 18000, revenue: 4900 },
//   { month: "2024-08", traffic: 17500, revenue: 4800 },
//   { month: "2024-09", traffic: 19000, revenue: 5200 },
//   { month: "2024-10", traffic: 20000, revenue: 5500 },
//   { month: "2024-11", traffic: 21000, revenue: 5800 },
//   { month: "2024-12", traffic: 22000, revenue: 6100 },
// ];

// const mockData5 = [
//   { Epoch: 1, Accuracy: 0.55 },
//   { Epoch: 2, Accuracy: 0.6 },
//   { Epoch: 3, Accuracy: 0.65 },
//   { Epoch: 4, Accuracy: 0.69 },
//   { Epoch: 5, Accuracy: 0.73 },
//   { Epoch: 6, Accuracy: 0.76 },
//   { Epoch: 7, Accuracy: 0.78 },
//   { Epoch: 8, Accuracy: 0.81 },
//   { Epoch: 9, Accuracy: 0.83 },
//   { Epoch: 10, Accuracy: 0.85 },
// ];

// const mockData6 = [
//   { education: "High School", satisfaction_score: 65 },
//   { education: "Associate Degree", satisfaction_score: 70 },
//   { education: "Bachelor's", satisfaction_score: 78 },
//   { education: "Master's", satisfaction_score: 82 },
//   { education: "PhD", satisfaction_score: 88 },
// ];

// const mockData7 = [
//   {
//     month: "2025-01",
//     region: "North America",
//     visits: 12000,
//     conversions: 480,
//   },
//   { month: "2025-01", region: "Europe", visits: 9500, conversions: 380 },
//   { month: "2025-01", region: "Asia", visits: 15000, conversions: 510 },
//   {
//     month: "2025-02",
//     region: "North America",
//     visits: 13000,
//     conversions: 520,
//   },
//   { month: "2025-02", region: "Europe", visits: 9700, conversions: 390 },
//   { month: "2025-02", region: "Asia", visits: 15800, conversions: 540 },
//   {
//     month: "2025-03",
//     region: "North America",
//     visits: 12500,
//     conversions: 510,
//   },
//   { month: "2025-03", region: "Europe", visits: 9400, conversions: 370 },
//   { month: "2025-03", region: "Asia", visits: 16200, conversions: 560 },
//   {
//     month: "2025-04",
//     region: "North America",
//     visits: 13500,
//     conversions: 550,
//   },
//   { month: "2025-04", region: "Europe", visits: 9900, conversions: 400 },
//   { month: "2025-04", region: "Asia", visits: 17000, conversions: 590 },
// ];

// num_1_cat_0_temp_1 --  mockData1
// num_1_cat_1_temp_1 --  mockData2
// num_1_cat_2_temp_1 --  mockData3
// num_2_cat_0_temp_1 --  mockData4
// num_1_cat_0_temp_0 --  mockData5
// num_1_cat_1_temp_0 --  mockData6
// num_2_cat_1_temp_1 --  mockData7

const colorPalette = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
  "#aec7e8",
  "#ffbb78",
  "#98df8a",
  "#ff9896",
  "#c5b0d5",
  "#c49c94",
  "#f7b6d2",
  "#c7c7c7",
  "#dbdb8d",
  "#9edae5",
];

const LineChart = ({ typeString, dataset }) => {
  const type = typeString;
  const mockData = dataset;
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
      data: [
        { x, y, type: "scatter", mode: "lines+markers", marker: { size: 6 } },
      ],
    };
  } else if (type === "num_1_cat_1_temp_1") {
    const [yKey, catKey, xKey] = Object.keys(mockData[0]);
    const categories = [...new Set(mockData.map((item) => item[catKey]))];
    const dates = [...new Set(mockData.map((item) => item[xKey]))].sort();

    const lineData = categories.map((category, index) => ({
      x: dates.map((date) => `${date}-01`),
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
      data: [
        { x, y, type: "scatter", mode: "lines+markers", marker: { size: 6 } },
      ],
    };
  } else if (type === "num_1_cat_1_temp_0") {
    const [yKey, xKey] = Object.keys(mockData[0]);

    const x = mockData.map((item) => item[xKey]);
    const y = mockData.map((item) => item[yKey]);

    const categories = [...new Set(x)];

    chart = {
      title: "Category + Ordered Numeric Sequence",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: [
        {
          x,
          y,
          type: "scatter",
          mode: "lines+markers",
          line: { color: "#1f77b4", width: 2 },
          marker: { size: 6 },
        },
      ],
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
              type: type.includes("temp_1")
                ? "date"
                : type === "num_1_cat_1_temp_0"
                ? "category"
                : "linear",
              tickangle: 45,
              tickfont: { size: 12 },
              automargin: true,
              tickformat:
                type === "num_2_cat_1_temp_1"
                  ? "%Y"
                  : type === "num_1_cat_1_temp_1"
                  ? "%Y-%m"
                  : undefined,
              range:
                type === "num_2_cat_1_temp_1"
                  ? [
                      new Date("2018-12-01").toISOString(),
                      new Date("2023-06-01").toISOString(),
                    ]
                  : undefined,
            },
            yaxis: {
              title: {
                text: chart.yAxisTitle || chart.yAxisTitle1,
                font: { size: 14 },
              },
              tickfont: { size: 12 },
              range:
                (type === "num_2_cat_1_temp_1" ||
                  type === "num_2_cat_0_temp_1") &&
                chart.yAxisTitle1
                  ? [
                      0,
                      Math.max(
                        ...mockData.map((item) => item[chart.yAxisTitle1])
                      ) * 1.1,
                    ]
                  : undefined,
              tickprefix: type === "num_2_cat_1_temp_1" ? "$" : undefined,
            },
            yaxis2: {
              title: { text: chart.yAxisTitle2 || "", font: { size: 14 } },
              tickfont: { size: 12 },
              overlaying: "y",
              side: "right",
              range:
                (type === "num_2_cat_1_temp_1" ||
                  type === "num_2_cat_0_temp_1") &&
                yKey2
                  ? [0, Math.max(...mockData.map((item) => item[yKey2])) * 1.1]
                  : undefined,
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