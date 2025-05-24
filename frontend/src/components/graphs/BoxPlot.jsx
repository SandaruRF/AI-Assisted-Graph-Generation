import React from "react";
import Plot from "react-plotly.js";

const mockData1 = [
{ value: 88 },
{ value: 92 },
{ value: 76 },
{ value: 81 },
{ value: 95 },
{ value: 67 },
{ value: 90 },
{ value: 85 },
];

const mockData2 = [
  { salary: 75000, job_role: "Engineer" },
  { salary: 72000, job_role: "Engineer" },
  { salary: 78000, job_role: "Engineer" },
  { salary: 95000, job_role: "Manager" },
  { salary: 91000, job_role: "Manager" },
  { salary: 97000, job_role: "Manager" },
  { salary: 62000, job_role: "Analyst" },
  { salary: 60000, job_role: "Analyst" },
  { salary: 63000, job_role: "Analyst" },
  { salary: 68000, job_role: "Designer" },
  { salary: 70000, job_role: "Designer" },
  { salary: 69000, job_role: "Designer" }
];

const mockData3 = [
  { sales: 100, month: "2024-01" },
  { sales: 120, month: "2024-01" },
  { sales: 105, month: "2024-01" },
  { sales: 90, month: "2024-02" },
  { sales: 110, month: "2024-02" },
  { sales: 115, month: "2024-02" },
  { sales: 130, month: "2024-03" },
  { sales: 105, month: "2024-03" },
  { sales: 125, month: "2024-03" }
];

const mockData4 = [
  { score: 78, school_type: "Public", gender: "Male" },
  { score: 82, school_type: "Public", gender: "Male" },
  { score: 75, school_type: "Public", gender: "Male" },
  { score: 88, school_type: "Public", gender: "Female" },
  { score: 91, school_type: "Public", gender: "Female" },
  { score: 85, school_type: "Public", gender: "Female" },
  { score: 90, school_type: "Private", gender: "Male" },
  { score: 87, school_type: "Private", gender: "Male" },
  { score: 92, school_type: "Private", gender: "Male" },
  { score: 95, school_type: "Private", gender: "Female" },
  { score: 98, school_type: "Private", gender: "Female" },
  { score: 93, school_type: "Private", gender: "Female" }
];

const mockData5 = [
  { height: 170, weight: 65, age: 25 },
  { height: 165, weight: 60, age: 30 },
  { height: 180, weight: 75, age: 28 },
  { height: 172, weight: 68, age: 35 },
  { height: 178, weight: 72, age: 40 },
  { height: 160, weight: 55, age: 22 },
  { height: 185, weight: 80, age: 33 },
  { height: 168, weight: 62, age: 26 },
  { height: 175, weight: 70, age: 31 },
  { height: 169, weight: 64, age: 27 }
];

const mockData6 = [
  { pulse_rate: 72, blood_pressure: 118, glucose_level: 95, cholesterol_level: 180 },
  { pulse_rate: 76, blood_pressure: 120, glucose_level: 90, cholesterol_level: 185 },
  { pulse_rate: 70, blood_pressure: 115, glucose_level: 92, cholesterol_level: 175 },
  { pulse_rate: 74, blood_pressure: 122, glucose_level: 88, cholesterol_level: 190 },
  { pulse_rate: 69, blood_pressure: 110, glucose_level: 94, cholesterol_level: 178 },
  { pulse_rate: 73, blood_pressure: 117, glucose_level: 96, cholesterol_level: 182 },
  { pulse_rate: 71, blood_pressure: 116, glucose_level: 91, cholesterol_level: 176 },
  { pulse_rate: 75, blood_pressure: 124, glucose_level: 89, cholesterol_level: 188 },
  { pulse_rate: 68, blood_pressure: 112, glucose_level: 93, cholesterol_level: 174 },
  { pulse_rate: 77, blood_pressure: 126, glucose_level: 97, cholesterol_level: 195 }
];

const mockData7 = [
  { electricity_usage: 320, region: "North" },
  { electricity_usage: 340, region: "North" },
  { electricity_usage: 310, region: "North" },
  { electricity_usage: 330, region: "North" },
  { electricity_usage: 900, region: "North" },     // outlier
  { electricity_usage: 280, region: "South" },
  { electricity_usage: 290, region: "South" },
  { electricity_usage: 270, region: "South" },
  { electricity_usage: 285, region: "South" },
  { electricity_usage: 800, region: "South" },     // outlier
  { electricity_usage: 300, region: "East" },
  { electricity_usage: 305, region: "East" },
  { electricity_usage: 295, region: "East" },
  { electricity_usage: 310, region: "East" },
  { electricity_usage: 1000, region: "East" },     // outlier
  { electricity_usage: 260, region: "West" },
  { electricity_usage: 255, region: "West" },
  { electricity_usage: 270, region: "West" },
  { electricity_usage: 265, region: "West" },
  { electricity_usage: 850, region: "West" }       // outlier
];

const mockData8 = [
  { training_time: 12, data_size_group: "1K" },
  { training_time: 13, data_size_group: "1K" },
  { training_time: 11, data_size_group: "1K" },
  { training_time: 14, data_size_group: "1K" },
  { training_time: 12, data_size_group: "1K" },
  { training_time: 20, data_size_group: "5K" },
  { training_time: 22, data_size_group: "5K" },
  { training_time: 21, data_size_group: "5K" },
  { training_time: 19, data_size_group: "5K" },
  { training_time: 23, data_size_group: "5K" },
  { training_time: 28, data_size_group: "10K" },
  { training_time: 30, data_size_group: "10K" },
  { training_time: 29, data_size_group: "10K" },
  { training_time: 31, data_size_group: "10K" },
  { training_time: 27, data_size_group: "10K" },
  { training_time: 45, data_size_group: "50K" },
  { training_time: 48, data_size_group: "50K" },
  { training_time: 50, data_size_group: "50K" },
  { training_time: 47, data_size_group: "50K" },
  { training_time: 46, data_size_group: "50K" },
  { training_time: 62, data_size_group: "100K" },
  { training_time: 65, data_size_group: "100K" },
  { training_time: 64, data_size_group: "100K" },
  { training_time: 63, data_size_group: "100K" },
  { training_time: 66, data_size_group: "100K" }
];


// num_1_cat_0_temp_0 --  mockData1
// num_1_cat_1_temp_0 --  mockData2
// num_1_cat_0_temp_1 --  mockData3
// num_1_cat_2_temp_0 --  mockData4
// num_n_cat_0_temp_0 --  mockData5(3num)
// num_n_cat_0_temp_0 --  mockData6(4num)
// num_1_cat_1_temp_0_outliers --  mockData7
// num_1_cat_1_temp_0_ordered --  mockData8

const type = "num_1_cat_0_temp_0"; 
const mockData = mockData1; 

function getBoxPlotsBothOrientations(type, mockData) {
  if (!mockData || mockData.length === 0) return null;

  const keys = Object.keys(mockData[0]);
  let verticalTraces = [];
  let horizontalTraces = [];
  let title = "";
  let xAxisTitleV = "";
  let yAxisTitleV = "";
  let xAxisTitleH = "";
  let yAxisTitleH = "";

  const uniqueCats = (key) => [...new Set(mockData.map(item => item[key]))];

  if (type === "num_1_cat_0_temp_0") {
    const [yKey] = keys;
    title = `Box Plot: ${yKey}`;
    xAxisTitleV = "";
    yAxisTitleV = yKey;
    xAxisTitleH = yKey;
    yAxisTitleH = "";

    verticalTraces = [{
      y: mockData.map(d => d[yKey]),
      type: "box",
      boxpoints: "all",
      jitter: 0.5,
      pointpos: 0,
      name: yKey,
      orientation: "v"
    }];

    horizontalTraces = [{
      x: mockData.map(d => d[yKey]),
      type: "box",
      boxpoints: "all",
      jitter: 0.5,
      pointpos: 0,
      name: yKey,
      orientation: "h"
    }];
  }
  else if (type === "num_1_cat_1_temp_0" || type === "num_1_cat_1_temp_0_ordered" || type === "num_1_cat_1_temp_0_outliers") {
    const [numKey, catKey] = keys;
    const categories = uniqueCats(catKey);
    title = `Box Plot: ${numKey} by ${catKey}`;
    xAxisTitleV = catKey;
    yAxisTitleV = numKey;
    xAxisTitleH = numKey;
    yAxisTitleH = catKey;

    verticalTraces = categories.map(cat => ({
      y: mockData.filter(d => d[catKey] === cat).map(d => d[numKey]),
      name: cat,
      type: "box",
      boxpoints: type === "num_1_cat_1_temp_0_outliers" ? "outliers" : "all",
      jitter: 0.5,
      pointpos: 0,
      orientation: "v"
    }));

    horizontalTraces = categories.map(cat => ({
      x: mockData.filter(d => d[catKey] === cat).map(d => d[numKey]),
      name: cat,
      type: "box",
      boxpoints: type === "num_1_cat_1_temp_0_outliers" ? "outliers" : "all",
      jitter: 0.5,
      pointpos: 0,
      orientation: "h"
    }));
  }
  else if (type === "num_1_cat_0_temp_1") {
    const [numKey, tempKey] = keys;
    const timeBuckets = uniqueCats(tempKey);
    title = `Box Plot: ${numKey} by ${tempKey}`;
    xAxisTitleV = tempKey;
    yAxisTitleV = numKey;
    xAxisTitleH = numKey;
    yAxisTitleH = tempKey;

    verticalTraces = timeBuckets.map(tb => ({
      y: mockData.filter(d => d[tempKey] === tb).map(d => d[numKey]),
      name: tb,
      type: "box",
      boxpoints: "all",
      jitter: 0.5,
      pointpos: 0,
      orientation: "v"
    }));

    horizontalTraces = timeBuckets.map(tb => ({
      x: mockData.filter(d => d[tempKey] === tb).map(d => d[numKey]),
      name: tb,
      type: "box",
      boxpoints: "all",
      jitter: 0.5,
      pointpos: 0,
      orientation: "h"
    }));
  }
  else if (type === "num_1_cat_2_temp_0") {
    const [cat1Key, cat2Key, numKey] = keys;
    const cat2Values = uniqueCats(cat2Key);
    title = `Box Plot: ${numKey} by ${cat1Key} and ${cat2Key}`;
    xAxisTitleV = cat1Key;
    yAxisTitleV = numKey;
    xAxisTitleH = numKey;
    yAxisTitleH = cat1Key;

    verticalTraces = cat2Values.map(cat2Val => ({
      y: mockData.filter(d => d[cat2Key] === cat2Val).map(d => d[numKey]),
      name: cat2Val,
      type: "box",
      boxpoints: "all",
      jitter: 0.5,
      pointpos: 0,
      orientation: "v"
    }));

    horizontalTraces = cat2Values.map(cat2Val => ({
      x: mockData.filter(d => d[cat2Key] === cat2Val).map(d => d[numKey]),
      name: cat2Val,
      type: "box",
      boxpoints: "all",
      jitter: 0.5,
      pointpos: 0,
      orientation: "h"
    }));
  }
  else if (type === "num_n_cat_0_temp_0") {
    const numericKeys = keys;
    title = "Box Plot: Multiple Numeric Variables";
    xAxisTitleV = "Category";
    yAxisTitleV = "Value";
    xAxisTitleH = "Value";
    yAxisTitleH = "Category";

    verticalTraces = numericKeys.map(numKey => ({
      y: mockData.map(d => d[numKey]),
      name: numKey,
      type: "box",
      boxpoints: "all",
      jitter: 0.5,
      pointpos: 0,
      orientation: "v"
    }));

    horizontalTraces = numericKeys.map(numKey => ({
      x: mockData.map(d => d[numKey]),
      name: numKey,
      type: "box",
      boxpoints: "all",
      jitter: 0.5,
      pointpos: 0,
      orientation: "h"
    }));
  }
  else {
    return null; 
  }

  return {
    title,
    vertical: {
      data: verticalTraces,
      layout: {
        width: 700,
        height: 400,
        title: { text: `${title} (Vertical)`, font: { size: 18 } },
        xaxis: { title: xAxisTitleV, type: "category", automargin: true },
        yaxis: { title: yAxisTitleV, automargin: true },
        boxmode: "group",
        margin: { l: 60, r: 60, t: 60, b: 60 },
        showlegend: true
      }
    },
    horizontal: {
      data: horizontalTraces,
      layout: {
        width: 700,
        height: 400,
        title: { text: `${title} (Horizontal)`, font: { size: 18 } },
        xaxis: { title: xAxisTitleH, automargin: true },
        yaxis: { title: yAxisTitleH, type: "category", automargin: true },
        boxmode: "group",
        margin: { l: 60, r: 60, t: 60, b: 60 },
        showlegend: true
      }
    }
  };
}

const BoxPlot = () => {
  const chart = getBoxPlotsBothOrientations(type, mockData);

  return chart ? (
    <div>
      <Plot data={chart.vertical.data} layout={chart.vertical.layout} />
      <Plot data={chart.horizontal.data} layout={chart.horizontal.layout} />
    </div>
  ) : (
    <div>No valid chart data available</div>
  );
};

export default BoxPlot;
