import React from "react";
import Plot from "react-plotly.js";

const mockData1 = [
  { Value: 450, Category: "Tech" },
  { Value: 300, Category: "Finance" },
  { Value: 200, Category: "Healthcare" },
  { Value: 150, Category: "Energy" },
  { Value: 100, Category: "Retail" },
];

const mockData2 = [
  { Value: 120, Region: "North", Product: "Electronics" },
  { Value: 80, Region: "North", Product: "Furniture" },
  { Value: 60, Region: "North", Product: "Clothing" },
  { Value: 100, Region: "South", Product: "Electronics" },
  { Value: 90, Region: "South", Product: "Furniture" },
  { Value: 50, Region: "South", Product: "Clothing" },
  { Value: 110, Region: "East", Product: "Electronics" },
  { Value: 70, Region: "East", Product: "Furniture" },
  { Value: 40, Region: "East", Product: "Clothing" },
  { Value: 130, Region: "West", Product: "Electronics" },
  { Value: 85, Region: "West", Product: "Furniture" },
  { Value: 55, Region: "West", Product: "Clothing" },
];

// num_1_cat_1_temp_0  --  mockData1
// num_1_cat_2_temp_0  --  mockData2

const PieChart = ({ typeString, dataset }) => {
  const type = typeString;
  const mockData = dataset;
  if (!mockData || mockData.length === 0) return null;

  const charts = [];
  const opacity = 0.9;
  let data,
    data1 = [];
  let title,
    title1,
    numericKey,
    categoryKey,
    categoryKey1 = "";

  if (type === "num_1_cat_1_temp_0") {
    [numericKey, categoryKey] = Object.keys(mockData[0]);

    const createPieTrace = (hole, title) => ({
      data: [
        {
          values: mockData.map((item) => item[numericKey]),
          labels: mockData.map((item) => item[categoryKey]),
          type: "pie",
          opacity: opacity,
          hole: hole,
          showlegend: true,
          legendgrouptitle: { text: categoryKey },
          hoverinfo: "text",
          hovertext: mockData.map(
            (item) =>
              `${categoryKey}: ${item[categoryKey]}<br>${numericKey}: ${item[numericKey]}`
          ),
          text: mockData.map((item) => `${numericKey}: ${item[numericKey]}`),
        },
      ],
      title: title,
    });

    charts.push(createPieTrace(0.0, "Basic Pie Chart"));
    charts.push(createPieTrace(0.4, "Donut Chart"));
  } else if (type === "num_1_cat_2_temp_0") {
    [numericKey, categoryKey, categoryKey1] = Object.keys(mockData[0]);
    let categories = [...new Set(mockData.map((item) => item[categoryKey]))];
    let categories1 = [...new Set(mockData.map((item) => item[categoryKey1]))];

    // categories - keys of category which has less cardinality
    // categories1 - keys of category which has high cardinality
    if (categories.length > categories1.length) {
      let temp = categoryKey;
      let temp1 = categories;
      categoryKey = categoryKey1;
      categoryKey1 = temp;
      categories = categories1;
      categories1 = temp1;
    }

    const labels = [];
    const parents = [];
    const values = [];
    const text = [];
    const hovertext = [];

    const parentSums = {};
    const parentNodes = new Set();

    // First, calculate the parent sums
    for (const row of mockData) {
      const parent = row[categoryKey];
      const value = row[numericKey];

      parentSums[parent] = (parentSums[parent] || 0) + value;
    }

    // Add parent nodes
    let totalSum = 0; // Sum of all values for percentage calculation
    for (const parent in parentSums) {
      totalSum += parentSums[parent];
    }

    // Add parent nodes with percentage
    for (const parent in parentSums) {
      const percentage = (parentSums[parent] / totalSum) * 100;
      labels.push(parent);
      parents.push("");
      values.push(parentSums[parent]);
      text.push(`${percentage.toFixed(2)}%`);
      hovertext.push(
        `${categoryKey}: ${parent}<br>Total ${numericKey}: ${parentSums[parent]}`
      );
      parentNodes.add(parent);
    }

    // Add unique child nodes with percentage
    for (const row of mockData) {
      const parent = row[categoryKey];
      const child = row[categoryKey1];
      const value = row[numericKey];

      const uniqueLabel = `${parent} - ${child}`; // unique child
      const percentage = (value / totalSum) * 100; // Calculate percentage for each child

      labels.push(uniqueLabel);
      parents.push(parent);
      values.push(value);
      text.push(`${percentage.toFixed(2)}%`);
      hovertext.push(
        `${categoryKey}: ${parent}<br>${categoryKey1}: ${child}<br>${numericKey}: ${value}`
      );
    }

    data = [
      {
        type: "sunburst",
        labels,
        parents,
        values,
        branchvalues: "total",
        text,
        hovertext,
        hoverinfo: "text",
      },
    ];
    title = "Grouped Pie Chart (Sunburst)";

    charts.push({
      data: data,
      title: title,
    });

    /////////////////////////////////////////////////////////////

    const category1Groups = {};
    mockData.forEach((item) => {
      if (!category1Groups[item[categoryKey1]]) {
        category1Groups[item[categoryKey1]] = [];
      }
      category1Groups[item[categoryKey1]].push(item);
    });
    const nCols = 2;
    const nRows = Math.ceil(categories1.length / nCols);

    const annotations = categories1.map((category1, i) => {
      const j = i < 2 ? 0 : 1;
      return {
        text: category1,
        showarrow: false,
        font: { size: 14 },
        // x: i * 1 + 1,
        // y: i * 1 + 0.5,
        x: 0.18 + 0.63 * (i % 2),
        y: 0.51 - 0.55 * (j % 2),
        xref: "paper",
        yref: "paper",
        align: "center",
      };
    });

    const createSubPieTrace = (hole, title) => ({
      data: categories1.map((category1, i) => {
        const group = category1Groups[category1];
        const labels = group.map((item) => item[categoryKey]);
        const values = group.map((item) => item[numericKey]);

        return {
          values: values,
          labels: labels,
          type: "pie",
          opacity: opacity,
          hole: hole,
          name: category1,
          domain: {
            row: Math.floor(i / nCols),
            column: i % nCols,
          },
          title: category1,
          showlegend: true,
          legendgrouptitle: { text: categoryKey },
          hoverinfo: "label+percent+name+text",
          text: values.map((val) => `${numericKey}: ${val}`),
        };
      }),
      title: title,
      height: 320 * nRows,
      rows: nRows,
      columns: nCols,
      annotations: annotations,
    });

    charts.push(createSubPieTrace(0.0, "Pie Chart Sub Plots"));
    charts.push(createSubPieTrace(0.4, "Donut Chart Sub Plots"));
  }

  return (
    <div>
      {charts.map((chart, index) => (
        <Plot
          key={index}
          data={chart.data}
          layout={{
            width: 640, // Adjust width based on number of columns
            height: chart.height || 480,
            title: { text: chart.title },
            grid: { rows: chart.rows || 1, columns: chart.columns || 1 },
            annotations: chart.annotations,
          }}
        />
      ))}
    </div>
  );
};

export default PieChart;