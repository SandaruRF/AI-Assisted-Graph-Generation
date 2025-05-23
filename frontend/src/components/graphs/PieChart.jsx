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



const PieChart = ({ typeString, dataset, colors, legendLabels }) => {
  const type = typeString;
  const mockData = dataset;
  if (!mockData || mockData.length === 0) return null;

  const charts = [];
  const opacity = 0.9;

  const getLegendName = (name) => legendLabels?.[name] || name;
  const getColor = (i) => (colors && colors[i]) || undefined;

  let numericKey, categoryKey, categoryKey1;

  if (type === "num_1_cat_1_temp_0") {
    [numericKey, categoryKey] = Object.keys(mockData[0]);

    const createPieTrace = (hole, title) => ({
      data: [
        {
          values: mockData.map((item) => item[numericKey]),
          labels: mockData.map((item) => getLegendName(item[categoryKey])),
          type: "pie",
          opacity,
          hole,
          marker: {
            colors: colors || undefined,
          },
          hoverinfo: "text",
          hovertext: mockData.map(
            (item) =>
              `${getLegendName(categoryKey)}: ${getLegendName(item[categoryKey])}<br>${numericKey}: ${item[numericKey]}`
          ),
          text: mockData.map((item) => `${numericKey}: ${item[numericKey]}`),
        },
      ],
      title,
    });

    charts.push(createPieTrace(0.0, "Basic Pie Chart"));
    charts.push(createPieTrace(0.4, "Donut Chart"));
  }

  else if (type === "num_1_cat_2_temp_0") {
    [numericKey, categoryKey, categoryKey1] = Object.keys(mockData[0]);
    let categories = [...new Set(mockData.map((item) => item[categoryKey]))];
    let categories1 = [...new Set(mockData.map((item) => item[categoryKey1]))];

    if (categories.length > categories1.length) {
      [categoryKey, categoryKey1] = [categoryKey1, categoryKey];
      [categories, categories1] = [categories1, categories];
    }

    const labels = [];
    const parents = [];
    const values = [];
    const text = [];
    const hovertext = [];

    const parentSums = {};
    const totalSum = mockData.reduce((sum, item) => sum + item[numericKey], 0);

    mockData.forEach((item) => {
      const parent = item[categoryKey];
      const value = item[numericKey];
      parentSums[parent] = (parentSums[parent] || 0) + value;
    });

    for (const parent in parentSums) {
      const val = parentSums[parent];
      labels.push(getLegendName(parent));
      parents.push("");
      values.push(val);
      text.push(`${((val / totalSum) * 100).toFixed(2)}%`);
      hovertext.push(
        `${getLegendName(categoryKey)}: ${getLegendName(parent)}<br>Total ${numericKey}: ${val}`
      );
    }

    mockData.forEach((row) => {
      const parent = getLegendName(row[categoryKey]);
      const child = getLegendName(row[categoryKey1]);
      const value = row[numericKey];
      labels.push(`${parent} - ${child}`);
      parents.push(parent);
      values.push(value);
      text.push(`${((value / totalSum) * 100).toFixed(2)}%`);
      hovertext.push(
        `${getLegendName(categoryKey)}: ${parent}<br>${getLegendName(categoryKey1)}: ${child}<br>${numericKey}: ${value}`
      );
    });

    charts.push({
      data: [
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
      ],
      title: "Grouped Pie Chart (Sunburst)",
    });

    // Subplot pie chart
    const groups = {};
    mockData.forEach((item) => {
      const key = item[categoryKey1];
      groups[key] = groups[key] || [];
      groups[key].push(item);
    });

    const nCols = 2;
    const nRows = Math.ceil(categories1.length / nCols);

    const annotations = categories1.map((cat, i) => {
      const j = Math.floor(i / nCols);
      return {
        text: getLegendName(cat),
        showarrow: false,
        font: { size: 14 },
        x: 0.18 + 0.63 * (i % 2),
        y: 0.51 - 0.55 * (j % 2),
        xref: "paper",
        yref: "paper",
        align: "center",
      };
    });

    const createSubPieTrace = (hole, title) => ({
      data: categories1.map((cat, i) => {
        const group = groups[cat];
        return {
          values: group.map((d) => d[numericKey]),
          labels: group.map((d) => getLegendName(d[categoryKey])),
          type: "pie",
          opacity,
          hole,
          name: getLegendName(cat),
          domain: {
            row: Math.floor(i / nCols),
            column: i % nCols,
          },
          title: getLegendName(cat),
          showlegend: true,
          text: group.map((d) => `${numericKey}: ${d[numericKey]}`),
          hoverinfo: "label+percent+name+text",
          marker: {
            colors: colors || undefined,
          },
        };
      }),
      title,
      height: 320 * nRows,
      rows: nRows,
      columns: nCols,
      annotations,
    });

    charts.push(createSubPieTrace(0.0, "Pie Chart Sub Plots"));
    charts.push(createSubPieTrace(0.4, "Donut Chart Sub Plots"));
  }

  return (
    <div>
      {charts.map((chart, i) => (
        <Plot
          key={i}
          data={chart.data}
          layout={{
            width: 640,
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



