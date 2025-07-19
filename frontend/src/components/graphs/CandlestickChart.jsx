import React from "react";
import Plot from "react-plotly.js";

// const mockData1 = [
//   { Open: 150.25, High: 155.1, Low: 149.8, Close: 154.0, Date: "2024-01-02" }, // up
//   { Open: 154.0, High: 156.5, Low: 153.5, Close: 152.5, Date: "2024-01-03" }, // down
//   { Open: 152.5, High: 153.7, Low: 150.9, Close: 151.8, Date: "2024-01-04" }, // down
//   { Open: 151.8, High: 154.2, Low: 150.0, Close: 153.2, Date: "2024-01-05" }, // up
//   { Open: 153.2, High: 155.0, Low: 152.7, Close: 154.6, Date: "2024-01-08" }, // up
//   { Open: 154.6, High: 156.1, Low: 153.0, Close: 152.2, Date: "2024-01-09" }, // down
//   { Open: 152.2, High: 153.9, Low: 151.0, Close: 151.5, Date: "2024-01-10" }, // down
//   { Open: 151.5, High: 154.0, Low: 150.5, Close: 153.7, Date: "2024-01-11" }, // up
//   { Open: 153.7, High: 155.3, Low: 152.1, Close: 154.8, Date: "2024-01-12" }, // up
//   { Open: 154.8, High: 156.4, Low: 153.5, Close: 153.0, Date: "2024-01-15" }, // down
//   { Open: 153.0, High: 154.5, Low: 151.9, Close: 152.6, Date: "2024-01-16" }, // down
//   { Open: 152.6, High: 153.8, Low: 150.2, Close: 151.3, Date: "2024-01-17" }, // down
//   { Open: 151.3, High: 153.6, Low: 150.7, Close: 152.9, Date: "2024-01-18" }, // up
//   { Open: 152.9, High: 154.2, Low: 151.8, Close: 153.5, Date: "2024-01-19" }, // up
//   { Open: 153.5, High: 155.0, Low: 152.0, Close: 154.4, Date: "2024-01-22" }, // up
// ];

// const mockData2 = [
//   // AAPL
//   {
//     Open: 150.5,
//     High: 153.0,
//     Low: 149.5,
//     Close: 152.3,
//     Symbol: "AAPL",
//     Date: "2024-01-02",
//   },
//   {
//     Open: 152.3,
//     High: 154.1,
//     Low: 151.0,
//     Close: 153.6,
//     Symbol: "AAPL",
//     Date: "2024-01-03",
//   },
//   {
//     Open: 153.6,
//     High: 154.8,
//     Low: 152.5,
//     Close: 152.0,
//     Symbol: "AAPL",
//     Date: "2024-01-04",
//   }, // ↓
//   {
//     Open: 152.0,
//     High: 153.2,
//     Low: 150.7,
//     Close: 151.1,
//     Symbol: "AAPL",
//     Date: "2024-01-05",
//   }, // ↓
//   {
//     Open: 151.1,
//     High: 152.5,
//     Low: 150.0,
//     Close: 151.7,
//     Symbol: "AAPL",
//     Date: "2024-01-08",
//   },
//   {
//     Open: 151.7,
//     High: 153.0,
//     Low: 150.9,
//     Close: 152.9,
//     Symbol: "AAPL",
//     Date: "2024-01-09",
//   },
//   {
//     Open: 152.9,
//     High: 154.5,
//     Low: 152.0,
//     Close: 153.2,
//     Symbol: "AAPL",
//     Date: "2024-01-10",
//   },
//   {
//     Open: 153.2,
//     High: 154.1,
//     Low: 151.8,
//     Close: 152.0,
//     Symbol: "AAPL",
//     Date: "2024-01-11",
//   }, // ↓
//   {
//     Open: 152.0,
//     High: 153.3,
//     Low: 151.0,
//     Close: 153.1,
//     Symbol: "AAPL",
//     Date: "2024-01-12",
//   },
//   {
//     Open: 153.1,
//     High: 154.6,
//     Low: 152.5,
//     Close: 154.0,
//     Symbol: "AAPL",
//     Date: "2024-01-15",
//   },

//   // MSFT
//   {
//     Open: 310.1,
//     High: 313.5,
//     Low: 309.0,
//     Close: 311.0,
//     Symbol: "MSFT",
//     Date: "2024-01-02",
//   },
//   {
//     Open: 311.0,
//     High: 314.5,
//     Low: 310.2,
//     Close: 313.9,
//     Symbol: "MSFT",
//     Date: "2024-01-03",
//   },
//   {
//     Open: 313.9,
//     High: 316.0,
//     Low: 312.5,
//     Close: 315.2,
//     Symbol: "MSFT",
//     Date: "2024-01-04",
//   },
//   {
//     Open: 315.2,
//     High: 316.5,
//     Low: 313.8,
//     Close: 314.1,
//     Symbol: "MSFT",
//     Date: "2024-01-05",
//   }, // ↓
//   {
//     Open: 314.1,
//     High: 315.0,
//     Low: 312.4,
//     Close: 313.0,
//     Symbol: "MSFT",
//     Date: "2024-01-08",
//   }, // ↓
//   {
//     Open: 313.0,
//     High: 314.7,
//     Low: 311.5,
//     Close: 314.4,
//     Symbol: "MSFT",
//     Date: "2024-01-09",
//   },
//   {
//     Open: 314.4,
//     High: 316.8,
//     Low: 313.0,
//     Close: 316.0,
//     Symbol: "MSFT",
//     Date: "2024-01-10",
//   },
//   {
//     Open: 316.0,
//     High: 317.5,
//     Low: 314.7,
//     Close: 315.1,
//     Symbol: "MSFT",
//     Date: "2024-01-11",
//   }, // ↓
//   {
//     Open: 315.1,
//     High: 316.2,
//     Low: 313.9,
//     Close: 314.7,
//     Symbol: "MSFT",
//     Date: "2024-01-12",
//   },
//   {
//     Open: 314.7,
//     High: 317.3,
//     Low: 313.5,
//     Close: 316.9,
//     Symbol: "MSFT",
//     Date: "2024-01-15",
//   },

//   // GOOG
//   {
//     Open: 2700.0,
//     High: 2725.0,
//     Low: 2685.0,
//     Close: 2710.5,
//     Symbol: "GOOG",
//     Date: "2024-01-02",
//   },
//   {
//     Open: 2710.5,
//     High: 2730.2,
//     Low: 2695.1,
//     Close: 2721.8,
//     Symbol: "GOOG",
//     Date: "2024-01-03",
//   },
//   {
//     Open: 2721.8,
//     High: 2740.0,
//     Low: 2708.0,
//     Close: 2715.4,
//     Symbol: "GOOG",
//     Date: "2024-01-04",
//   }, // ↓
//   {
//     Open: 2715.4,
//     High: 2730.0,
//     Low: 2700.5,
//     Close: 2710.0,
//     Symbol: "GOOG",
//     Date: "2024-01-05",
//   }, // ↓
//   {
//     Open: 2710.0,
//     High: 2722.5,
//     Low: 2698.3,
//     Close: 2708.7,
//     Symbol: "GOOG",
//     Date: "2024-01-08",
//   },
//   {
//     Open: 2708.7,
//     High: 2720.0,
//     Low: 2695.9,
//     Close: 2719.3,
//     Symbol: "GOOG",
//     Date: "2024-01-09",
//   },
//   {
//     Open: 2719.3,
//     High: 2745.0,
//     Low: 2708.2,
//     Close: 2735.5,
//     Symbol: "GOOG",
//     Date: "2024-01-10",
//   },
//   {
//     Open: 2735.5,
//     High: 2750.5,
//     Low: 2721.4,
//     Close: 2732.0,
//     Symbol: "GOOG",
//     Date: "2024-01-11",
//   }, // ↓
//   {
//     Open: 2732.0,
//     High: 2740.0,
//     Low: 2715.3,
//     Close: 2728.6,
//     Symbol: "GOOG",
//     Date: "2024-01-12",
//   },
//   {
//     Open: 2728.6,
//     High: 2755.0,
//     Low: 2718.7,
//     Close: 2744.9,
//     Symbol: "GOOG",
//     Date: "2024-01-15",
//   },
// ];

// num_4_cat_0_temp_1  --  mockData1  ***open, high, low, close, time***
// num_4_cat_1_temp_1  --  mockData2  ***open, high, low, close, category, time***

const CandlestickChart = ({ typeString, dataset }) => {
  const type = typeString;
  const mockData = dataset;
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
    timeKey = "";

  if (type === "num_4_cat_0_temp_1") {
    [open, high, low, close, timeKey] = Object.keys(mockData[0]);

    data = [
      {
        x: mockData.map((item) => item[timeKey]),
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
        showlegend: false,
      },
    ];

    title = "Basic Candlestick Chart";
    xKey = timeKey;
    yKey = "Price";
  } else if (type === "num_4_cat_1_temp_1") {
    [open, high, low, close, categoryKey, timeKey] = Object.keys(mockData[0]);

    const categories = [...new Set(mockData.map((item) => item[categoryKey]))];

    data = categories.map((category, i) => {
      const filtered = mockData.filter(
        (item) => item[categoryKey] === category
      );

      return {
        name: category,
        x: filtered.map((item) => item[timeKey]),
        open: filtered.map((item) => item[open]),
        high: filtered.map((item) => item[high]),
        low: filtered.map((item) => item[low]),
        close: filtered.map((item) => item[close]),
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
        legendgroup: category,
        ...(i === 0 && { legendgrouptitle: { text: categoryKey } }),
        showlegend: true,
      };
    });

    title = "Grouped Candlestick Chart";
    xKey = timeKey;
    yKey = "Price";
  }

  const layout = {
    width: 640,
    height: 480,
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
    showlegend: true,
  };

  return <Plot data={data} layout={layout} />;
};

export default CandlestickChart;