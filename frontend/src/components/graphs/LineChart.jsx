import React from "react";
import Plot from "react-plotly.js";

const mockData1 = [
  { "Month": "2025-01-01", "Temperature": 4.2 },
  { "Month": "2025-02-01", "Temperature": 5.0 },
  { "Month": "2025-03-01", "Temperature": 9.3 },
  { "Month": "2025-04-01", "Temperature": 14.8 },
  { "Month": "2025-05-01", "Temperature": 19.6 },
  { "Month": "2025-06-01", "Temperature": 24.1 },
  { "Month": "2025-07-01", "Temperature": 27.3 },
  { "Month": "2025-08-01", "Temperature": 26.8 },
  { "Month": "2025-09-01", "Temperature": 22.5 },
  { "Month": "2025-10-01", "Temperature": 16.0 },
  { "Month": "2025-11-01", "Temperature": 9.4 },
  { "Month": "2025-12-01", "Temperature": 5.1 }
]
;

const type = "num_1_cat_0_temp_1";
const mockData = mockData1;

const LineChart = () => {
  const charts = [];

  if (type === "num_1_cat_0_temp_1") {
    const [xKey, yKey] = Object.keys(mockData[0]);
    const x = mockData.map((item) => Object.values(item)[0]);
    const y = mockData.map((item) => Object.values(item)[1]);

    charts.push({
      title: "Simple Univariate Time Series",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: [{ x, y, type: "Time", mode: "lines" }],
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
              type: "date",
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

export default LineChart;