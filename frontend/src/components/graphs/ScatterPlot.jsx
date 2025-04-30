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

// num_2_cat_0_temp_0  --  mockData1
const type = "num_2_cat_0_temp_0";
const mockData = mockData1;

const ScatterPlot = () => {
  const charts = [];

  if (type === "num_2_cat_0_temp_0") {
    const [xKey, yKey] = Object.keys(mockData[0]);
    const x = mockData.map((item) => Object.values(item)[0]);
    const y = mockData.map((item) => Object.values(item)[1]);

    charts.push({
      title: "Basic Scatter Plot",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: [{ x, y, type: "scatter", mode: "markers" }],
    });
  }

  return (
    <div>
      {charts.map((chart, index) => (
        <Plot
          key={index}
          data={chart.data}
          layout={{
            width: 640,
            height: 480,
            title: { text: chart.title },
            xaxis: {
              title: {
                text: chart.xAxisTitle,
              },
            },
            yaxis: {
              title: {
                text: chart.yAxisTitle,
              },
            },
          }}
        />
      ))}
    </div>
  );
};

export default ScatterPlot;
