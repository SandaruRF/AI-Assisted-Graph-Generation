import React from "react";
import Plot from "react-plotly.js";

/*const type = "num_1_cat_1_temp_1"; 
const Data = [
  { month: "2024-01", city: "Colombo", temperature: 28 },
  { month: "2024-01", city: "Kandy", temperature: 22 },
  { month: "2024-02", city: "Colombo", temperature: 29 },
  { month: "2024-02", city: "Kandy", temperature: 23 },
  { month: "2024-03", city: "Colombo", temperature: 31 },
  { month: "2024-03", city: "Kandy", temperature: 25 }
]
;*/

const type = "num_1_cat_0_temp_1"; 

const Data = [
  { time: "2024-01", rainfall: 78 },
  { time: "2024-02", rainfall: 65 },
  { time: "2024-03", rainfall: 89 },
  { time: "2024-04", rainfall: 102 },
  { time: "2024-05", rainfall: 75 }
];

const LineChart = () => {
  const sample = Data[0];
  const keys = Object.keys(sample);

  const isTimeString = (val) =>
    typeof val === "string" && /^\d{4}-\d{2}(-\d{2})?$/.test(val);

  const isNumeric = (val) => typeof val === "number";

  let timeKey, categoryKey, valueKey;
  for (let key of keys) {
    const val = sample[key];
    if (!timeKey && isTimeString(val)) timeKey = key;
    else if (!valueKey && isNumeric(val)) valueKey = key;
  }

  categoryKey = keys.find((k) => k !== timeKey && k !== valueKey);

  const layout = {
    title: "Dynamic Time Series Line Chart",
    xaxis: { title: timeKey, type: "date" },
    yaxis: { title: valueKey },
    width: 700,
    height: 500,
  };

  let data = [];

  if (type === "num_1_cat_1_temp_1") {
    const categories = [...new Set(Data.map((item) => item[categoryKey]))];

    data = categories.map((cat) => {
      const filtered = Data.filter((d) => d[categoryKey] === cat);
      return {
        x: filtered.map((d) => normalizeDate(d[timeKey])),
        y: filtered.map((d) => d[valueKey]),
        type: "scatter",
        mode: "lines+markers",
        name: cat,
      };
    });
  } else if (type === "num_1_cat_0_temp_1") {
    data = [
      {
        x: Data.map((d) => normalizeDate(d[timeKey])),
        y: Data.map((d) => d[valueKey]),
        type: "scatter",
        mode: "lines+markers",
        name: "Value",
      },
    ];
  }

  return <Plot data={data} layout={layout} />;
};

const normalizeDate = (val) =>
  /^\d{4}-\d{2}$/.test(val) ? `${val}-01` : val;

export default LineChart;
