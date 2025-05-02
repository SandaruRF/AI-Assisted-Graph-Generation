import React from "react";
import Plot from "react-plotly.js";

const mockData1 = [
  { StudyHours: 1, ExamScore: 52 },
  { StudyHours: 2, ExamScore: 58 },
  { StudyHours: 3, ExamScore: 63 },
  { StudyHours: 4, ExamScore: 67 },
  { StudyHours: 5, ExamScore: 72 },
  { StudyHours: 6, ExamScore: 75 },
  { StudyHours: 7, ExamScore: 78 },
  { StudyHours: 8, ExamScore: 82 },
  { StudyHours: 9, ExamScore: 88 },
  { StudyHours: 10, ExamScore: 93 },
];

const mockData2 = [
  { EducationYears: 10, Income: 30000, Gender: "Male" },
  { EducationYears: 12, Income: 35000, Gender: "Female" },
  { EducationYears: 14, Income: 42000, Gender: "Male" },
  { EducationYears: 16, Income: 50000, Gender: "Female" },
  { EducationYears: 18, Income: 62000, Gender: "Male" },
  { EducationYears: 20, Income: 70000, Gender: "Female" },
  { EducationYears: 12, Income: 36000, Gender: "Other" },
  { EducationYears: 16, Income: 48000, Gender: "Other" },
  { EducationYears: 14, Income: 40000, Gender: "Male" },
  { EducationYears: 18, Income: 65000, Gender: "Female" },
];

const mockData3 = [
  { Speed: 60, Volume: 200, Timestamp: "2024-01-01T08:00:00Z" },
  { Speed: 58, Volume: 250, Timestamp: "2024-01-01T09:00:00Z" },
  { Speed: 55, Volume: 280, Timestamp: "2024-01-01T10:00:00Z" },
  { Speed: 50, Volume: 300, Timestamp: "2024-01-01T11:00:00Z" },
  { Speed: 45, Volume: 320, Timestamp: "2024-01-01T12:00:00Z" },
  { Speed: 48, Volume: 310, Timestamp: "2024-01-01T13:00:00Z" },
  { Speed: 52, Volume: 290, Timestamp: "2024-01-01T14:00:00Z" },
  { Speed: 57, Volume: 260, Timestamp: "2024-01-01T15:00:00Z" },
  { Speed: 59, Volume: 230, Timestamp: "2024-01-01T16:00:00Z" },
  { Speed: 61, Volume: 210, Timestamp: "2024-01-01T17:00:00Z" },
];

const mockData4 = [
  {
    Speed: 60,
    Volume: 200,
    Category: "Urban",
    Timestamp: "2024-01-01T08:00:00Z",
  },
  {
    Speed: 58,
    Volume: 250,
    Category: "Urban",
    Timestamp: "2024-01-01T09:00:00Z",
  },
  {
    Speed: 55,
    Volume: 280,
    Category: "Urban",
    Timestamp: "2024-01-01T10:00:00Z",
  },
  {
    Speed: 50,
    Volume: 300,
    Category: "Urban",
    Timestamp: "2024-01-01T11:00:00Z",
  },
  {
    Speed: 65,
    Volume: 180,
    Category: "Highway",
    Timestamp: "2024-01-01T08:00:00Z",
  },
  {
    Speed: 68,
    Volume: 160,
    Category: "Highway",
    Timestamp: "2024-01-01T09:00:00Z",
  },
  {
    Speed: 66,
    Volume: 170,
    Category: "Highway",
    Timestamp: "2024-01-01T10:00:00Z",
  },
  {
    Speed: 63,
    Volume: 190,
    Category: "Highway",
    Timestamp: "2024-01-01T11:00:00Z",
  },
];

const mockData5 = [
  { GDP: 40000, LifeExpectancy: 82, Population: 50000000 },
  { GDP: 35000, LifeExpectancy: 80, Population: 30000000 },
  { GDP: 25000, LifeExpectancy: 78, Population: 70000000 },
  { GDP: 15000, LifeExpectancy: 70, Population: 120000000 },
  { GDP: 10000, LifeExpectancy: 65, Population: 140000000 },
  { GDP: 5000, LifeExpectancy: 60, Population: 90000000 },
];

const mockData6 = [
  { GDP: 40000, LifeExpectancy: 82, Population: 50000000, Region: "Europe" },
  { GDP: 35000, LifeExpectancy: 80, Population: 30000000, Region: "Europe" },
  { GDP: 25000, LifeExpectancy: 78, Population: 70000000, Region: "Asia" },
  { GDP: 15000, LifeExpectancy: 70, Population: 120000000, Region: "Asia" },
  { GDP: 10000, LifeExpectancy: 65, Population: 140000000, Region: "Africa" },
  { GDP: 5000, LifeExpectancy: 60, Population: 90000000, Region: "Africa" },
];

// num_2_cat_0_temp_0  --  mockData1
// num_2_cat_1_temp_0  --  mockData2
// num_2_cat_0_temp_1  --  mockData3
// num_2_cat_1_temp_1  --  mockData4   ***8 categories only***
// num_3_cat_0_temp_0  --  mockData5
// num_3_cat_1_temp_0  --  mockData6
const type = "num_2_cat_1_temp_1";
const mockData = mockData4;

const ScatterPlot = () => {
  if (!mockData || mockData.length === 0) return null;

  let data = [];
  let title = "";
  let xKey,
    yKey,
    categoryKey,
    timeKey = "";

  if (type === "num_2_cat_1_temp_0") {
    [xKey, yKey, categoryKey] = Object.keys(mockData[0]);
    const categories = [...new Set(mockData.map((item) => item[categoryKey]))];

    data = categories.map((category, i) => {
      const filtered = mockData.filter(
        (item) => item[categoryKey] === category
      );
      return {
        x: filtered.map((item) => item[xKey]),
        y: filtered.map((item) => item[yKey]),
        type: "scatter",
        mode: "markers",
        name: category,
        showlegend: true,
        ...(i === 0 && { legendgrouptitle: { text: categoryKey } }),
      };
    });

    title = "Grouped Scatter Plot";
  } else if (type === "num_2_cat_0_temp_0") {
    [xKey, yKey] = Object.keys(mockData[0]);

    data = [
      {
        x: mockData.map((item) => item[xKey]),
        y: mockData.map((item) => item[yKey]),
        type: "scatter",
        mode: "markers",
      },
    ];

    title = "Basic Scatter Plot";
  } else if (type === "num_2_cat_0_temp_1") {
    [xKey, yKey, timeKey] = Object.keys(mockData[0]);
    const timestamps = mockData.map((item) => item[timeKey]);
    const numericTimestamps = timestamps.map((ts) => new Date(ts).getTime());

    data = [
      {
        x: mockData.map((item) => item[xKey]),
        y: mockData.map((item) => item[yKey]),
        type: "scatter",
        mode: "markers",
        marker: {
          color: numericTimestamps,
          showscale: true,
          colorbar: {
            title: {
              text: timeKey,
            },
            tickvals: numericTimestamps,
            ticktext: timestamps,
          },
        },
        text: mockData.map(
          (item) =>
            `(${item[xKey]}, ${item[yKey]})<br>${timeKey}: ${item[timeKey]}`
        ),
        hoverinfo: "text",
      },
    ];

    title = "Time-Based Scatter Plot";
  } else if (type === "num_2_cat_1_temp_1") {
    [xKey, yKey, categoryKey, timeKey] = Object.keys(mockData[0]);
    const timestamps = mockData.map((item) => item[timeKey]);
    const numericTimestamps = timestamps.map((ts) => new Date(ts).getTime());
    const categories = [...new Set(mockData.map((item) => item[categoryKey]))];
    const availableSymbols = [
      "circle",
      "square",
      "diamond",
      "cross",
      "x",
      "triangle-up",
      "triangle-down",
      "star",
    ];
    const symbolMap = {};
    categories.forEach(
      (cat, i) =>
        (symbolMap[cat] = availableSymbols[i % availableSymbols.length])
    );

    data = [
      {
        x: mockData.map((item) => item[xKey]),
        y: mockData.map((item) => item[yKey]),
        type: "scatter",
        mode: "markers",
        marker: {
          color: numericTimestamps,
          showscale: true,
          symbol: mockData.map((item) => symbolMap[item[categoryKey]]),
          colorbar: {
            title: {
              text: timeKey,
            },
            tickvals: numericTimestamps,
            ticktext: timestamps,
          },
        },
        text: mockData.map(
          (item) =>
            `(${item[xKey]}, ${item[yKey]})<br>${categoryKey}: ${item[categoryKey]}<br>${timeKey}: ${item[timeKey]}`
        ),
        hoverinfo: "text",
      },
    ];

    title = "Time-Based Scatter Plot";
  } else if (type === "num_3_cat_0_temp_0") {
    [xKey, yKey] = Object.keys(mockData[0]);

    const rawSizes = mockData.map((item) => Object.values(item)[2]);
    const minVal = Math.min(...rawSizes);
    const maxVal = Math.max(...rawSizes);
    const normalizedValues = rawSizes.map(
      (val) => (val - minVal) / (maxVal - minVal)
    );
    const scaledSizes = normalizedValues.map((val) => 10 + val * 40); // range 10-50

    data = [
      {
        x: mockData.map((item) => item[xKey]),
        y: mockData.map((item) => item[yKey]),
        type: "scatter",
        mode: "markers",
        marker: {
          size: scaledSizes,
          sizemode: "diameter",
          sizeref: 1,
          sizemin: 5,
        },
        text: mockData.map(
          (item) =>
            `(${item[xKey]}, ${item[yKey]})<br>${Object.keys(item)[2]}: ${
              Object.values(item)[2]
            }`
        ),
        hoverinfo: "text",
      },
    ];

    title = "Bubble Chart";
  } else if (type === "num_3_cat_1_temp_0") {
    [xKey, yKey] = Object.keys(mockData[0]);
    categoryKey = Object.keys(mockData[0])[3];

    const rawSizes = mockData.map((item) => Object.values(item)[2]);
    const minVal = Math.min(...rawSizes);
    const maxVal = Math.max(...rawSizes);
    const normalizedValues = rawSizes.map(
      (val) => (val - minVal) / (maxVal - minVal)
    );
    const scaledSizes = normalizedValues.map((val) => 10 + val * 40); // range 10-50
    const categories = [...new Set(mockData.map((item) => item[categoryKey]))];

    data = categories.map((category, i) => {
      const filtered = mockData
        .map((item, idx) => ({ ...item, size: scaledSizes[idx] }))
        .filter((item) => item[categoryKey] === category);
      return {
        x: filtered.map((item) => item[xKey]),
        y: filtered.map((item) => item[yKey]),
        type: "scatter",
        mode: "markers",
        marker: {
          size: filtered.map((item) => item.size),
          sizemode: "diameter",
          sizeref: 1,
          sizemin: 5,
        },
        name: category,
        showlegend: true,
        ...(i === 0 && { legendgrouptitle: { text: categoryKey } }),
        text: filtered.map(
          (item) =>
            `(${item[xKey]}, ${item[yKey]})<br>${Object.keys(item)[2]}: ${
              Object.values(item)[2]
            }`
        ),
        hoverinfo: "text",
      };
    });

    title = "Bubble Chart";
  }

  const layout = {
    width: 640,
    height: 480,
    title: { text: title },
    xaxis: { title: { text: xKey } },
    yaxis: { title: { text: yKey } },
  };

  return <Plot data={data} layout={layout} />;
};

export default ScatterPlot;
