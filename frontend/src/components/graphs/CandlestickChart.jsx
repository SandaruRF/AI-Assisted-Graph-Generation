import React from "react";
import Plot from "react-plotly.js";

const mockData1 = [
  { Open: 150.25, High: 155.1, Low: 149.8, Close: 154.0, Date: "2024-01-02" }, // up
  { Open: 154.0, High: 156.5, Low: 153.5, Close: 152.5, Date: "2024-01-03" }, // down
  { Open: 152.5, High: 153.7, Low: 150.9, Close: 151.8, Date: "2024-01-04" }, // down
  { Open: 151.8, High: 154.2, Low: 150.0, Close: 153.2, Date: "2024-01-05" }, // up
  { Open: 153.2, High: 155.0, Low: 152.7, Close: 154.6, Date: "2024-01-08" }, // up
  { Open: 154.6, High: 156.1, Low: 153.0, Close: 152.2, Date: "2024-01-09" }, // down
  { Open: 152.2, High: 153.9, Low: 151.0, Close: 151.5, Date: "2024-01-10" }, // down
  { Open: 151.5, High: 154.0, Low: 150.5, Close: 153.7, Date: "2024-01-11" }, // up
  { Open: 153.7, High: 155.3, Low: 152.1, Close: 154.8, Date: "2024-01-12" }, // up
  { Open: 154.8, High: 156.4, Low: 153.5, Close: 153.0, Date: "2024-01-15" }, // down
  { Open: 153.0, High: 154.5, Low: 151.9, Close: 152.6, Date: "2024-01-16" }, // down
  { Open: 152.6, High: 153.8, Low: 150.2, Close: 151.3, Date: "2024-01-17" }, // down
  { Open: 151.3, High: 153.6, Low: 150.7, Close: 152.9, Date: "2024-01-18" }, // up
  { Open: 152.9, High: 154.2, Low: 151.8, Close: 153.5, Date: "2024-01-19" }, // up
  { Open: 153.5, High: 155.0, Low: 152.0, Close: 154.4, Date: "2024-01-22" }, // up
];

// num_4_cat_0_temp_1  --  mockData1  ***open, high, low, close, time***
const type = "num_4_cat_0_temp_1";
const mockData = mockData1;

const CandlestickChart = () => {
  if (!mockData || mockData.length === 0) return null;

  let data = [];
  let title,
    xKey,
    yKey,
    open,
    high,
    low,
    close,
    categoryKey,
    categoryKey1,
    timeKey = "";

  if (type === "num_4_cat_0_temp_1") {
    [open, high, low, close, timeKey] = Object.keys(mockData[0]);

    data = [
      {
        x: mockData.map((item) => item[timeKey]),
        y: mockData.map((item) => item[yKey]),
        open: mockData.map((item) => item[open]),
        high: mockData.map((item) => item[high]),
        low: mockData.map((item) => item[low]),
        close: mockData.map((item) => item[close]),
        increasing: {
          line: { color: "rgb(72, 187, 90)" },
          fillcolor: "rgba(188,235,193,255)1",
        },
        decreasing: {
          line: { color: "rgb(249,51,68)" },
          fillcolor: "rgba(249,181,180,255)",
        },
        type: "candlestick",
        xaxis: "x",
        yaxis: "y",
      },
    ];

    title = "Candlestick Chart";
    xKey = timeKey;
    yKey = "Price";
  }

  const layout = {
    width: 640,
    height: 480,
    showlegend: false,
    title: { text: title },
    xaxis: {
      title: { text: xKey },
      type: "date",
      autorange: true,
      domain: [0, 1],
      rangeslider: { visible: true },
    },
    yaxis: {
      title: { text: yKey },
      type: "linear",
      autorange: true,
      domain: [0, 1],
    },
  };

  return <Plot data={data} layout={layout} />;
};

export default CandlestickChart;
