import React, { useState, useEffect } from "react";
import ChartRenderer from "../components/graphs/ChartRenderer";


const ChartPreview = () => {
  const [dataset, setDataset] = useState([]);
  const [chartType, setChartType] = useState("line");

  return (
    <div>
      <h1>Chart Preview</h1>
      <div>
        <label>Choose Chart Type: </label>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="scatter">Scatter Plot</option>
          <option value="hist">Histogram</option>
          <option value="box">Box Plot</option>
          <option value="candle">Candlestick Chart</option>
          <option value="area">Area Chart</option>
        </select>
      </div>
      
      {dataset.length > 0 ? (
        <ChartRenderer typeString={chartType} dataset={dataset} />
      ) : (
        <div>Loading data...</div>
      )}
    </div>
  );
};

export default ChartPreview;
