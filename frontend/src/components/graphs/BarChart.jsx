import React from "react";
import Plot from "react-plotly.js";

// const mockData1 = [
//   { Revenue: 12500, Product: "Product A" },
//   { Revenue: 8700, Product: "Product B" },
//   { Revenue: 15300, Product: "Product C" },
//   { Revenue: 10100, Product: "Product D" },
//   { Revenue: 13800, Product: "Product E" },
// ];

// const mockData2 = [
//   { Sales: 12000, Month: "2024-01" },
//   { Sales: 13500, Month: "2024-02" },
//   { Sales: 12800, Month: "2024-03" },
//   { Sales: 14500, Month: "2024-04" },
//   { Sales: 15200, Month: "2024-05" },
//   { Sales: 13900, Month: "2024-06" },
// ];

// const mockData3 = [
//   { Sales: 15000, Region: "North", Product: "Laptop" },
//   { Sales: 12000, Region: "South", Product: "Laptop" },
//   { Sales: 13500, Region: "East", Product: "Laptop" },
//   { Sales: 11000, Region: "West", Product: "Laptop" },
//   { Sales: 12500, Region: "Central", Product: "Laptop" },
//   { Sales: 10000, Region: "North", Product: "Phone" },
//   { Sales: 9000, Region: "South", Product: "Phone" },
//   { Sales: 9500, Region: "East", Product: "Phone" },
//   { Sales: 8700, Region: "West", Product: "Phone" },
//   { Sales: 9100, Region: "Central", Product: "Phone" },
//   { Sales: 8000, Region: "North", Product: "Tablet" },
//   { Sales: 8500, Region: "South", Product: "Tablet" },
//   { Sales: 7800, Region: "East", Product: "Tablet" },
//   { Sales: 7200, Region: "West", Product: "Tablet" },
//   { Sales: 7600, Region: "Central", Product: "Tablet" },
// ];

// const mockData4 = [
//   { Sales: 5000, Region: "North", Month: "2024-01" },
//   { Sales: 7000, Region: "South", Month: "2024-01" },
//   { Sales: 6000, Region: "North", Month: "2024-02" },
//   { Sales: 7500, Region: "South", Month: "2024-02" },
//   { Sales: 5800, Region: "North", Month: "2024-03" },
//   { Sales: 7000, Region: "South", Month: "2024-03" },
//   { Sales: 6400, Region: "North", Month: "2024-04" },
//   { Sales: 8100, Region: "South", Month: "2024-04" },
//   { Sales: 7000, Region: "North", Month: "2024-05" },
//   { Sales: 8200, Region: "South", Month: "2024-05" },
//   { Sales: 6700, Region: "North", Month: "2024-06" },
//   { Sales: 7200, Region: "South", Month: "2024-06" },
// ];

// const mockData5 = [
//   { Revenue: 15000, Profit: 4000, Cost: 11000, Product: "Product A" },
//   { Revenue: 12000, Profit: 3000, Cost: 9000, Product: "Product B" },
//   { Revenue: 18000, Profit: 5000, Cost: 13000, Product: "Product C" },
//   { Revenue: 14000, Profit: 3500, Cost: 10500, Product: "Product D" },
//   { Revenue: 16000, Profit: 4200, Cost: 11800, Product: "Product E" },
// ];

// num_1_cat_1_temp_0  --  mockData1/
// num_1_cat_2_temp_0  --  mockData3/
// num_1_cat_0_temp_1  --  mockData2/
// num_1_cat_1_temp_1  --  mockData4/
// num_n_cat_1_temp_0  --  mocData5

const generateGroupedOrStackedAxis = (type, axis, data, orientation = "v") => {
  let xKey, yKey;

  const keys = Object.keys(data[0]);

  // Utility: Get key with highest cardinality between keys[1] and keys[2]
  const getHighCardinalityKey = () => {
    const key1 = keys[1];
    const key2 = keys[2];

    const unique1 = new Set(data.map((d) => d[key1])).size;
    const unique2 = new Set(data.map((d) => d[key2])).size;

    return unique1 >= unique2 ? key1 : key2;
  };

  if (type === "num_1_cat_2_temp_0") {
    yKey = keys[0];
    xKey = getHighCardinalityKey();
  } else if (type === "num_1_cat_1_temp_1") {
    yKey = keys[0];
    xKey = keys[2];
  } else if (type === "num_n_cat_1_temp_0") {
    yKey = undefined;
    xKey = keys[keys.length - 1];
  }
  if (axis === "x") {
    return orientation === "v" ? xKey : yKey;
  } else if (axis === "y") {
    return orientation === "v" ? yKey : xKey;
  }
};

const generateGroupedOrStackedData = (type, data, orientation = "v") => {
  if (type === "num_1_cat_2_temp_0") {
    const keys = Object.keys(data[0]);

    // Identify columns
    const numKey = keys[0];
    const key1 = keys[1];
    const key2 = keys[2];

    // Measure cardinality
    const unique1 = new Set(data.map((d) => d[key1])).size;
    const unique2 = new Set(data.map((d) => d[key2])).size;

    const cat1Key = unique1 >= unique2 ? key1 : key2; // Higher cardinality
    const cat2Key = unique1 >= unique2 ? key2 : key1; // Lower cardinality

    const cat1 = [...new Set(data.map((item) => item[cat1Key]))];
    const cat2 = [...new Set(data.map((item) => item[cat2Key]))];

    return cat2.map((cat2Val, i) => ({
      [orientation === "v" ? "x" : "y"]: cat1,
      [orientation === "v" ? "y" : "x"]: cat1.map((cat1Val) => {
        const entry = data.find(
          (item) => item[cat1Key] === cat1Val && item[cat2Key] === cat2Val
        );
        return entry ? entry[numKey] : 0;
      }),
      name: cat2Val,
      legendgroup: "cat_2",
      showlegend: true,
      ...(i === 0 && { legendgrouptitle: { text: cat2Key } }),
      type: "bar",
      orientation: orientation === "h" ? "h" : undefined,
    }));
  } else if (type === "num_1_cat_1_temp_1") {
    const legendGroupTitle = Object.keys(data[0])[1];
    const cat1 = [...new Set(data.map((item) => Object.values(item)[2]))];
    const cat2 = [...new Set(data.map((item) => Object.values(item)[1]))];

    return cat2.map((cat_2_val, i) => ({
      [orientation === "v" ? "x" : "y"]: cat1,
      [orientation === "v" ? "y" : "x"]: cat1.map((cat_1_val) => {
        const entry = data.find(
          (item) =>
            Object.values(item)[2] === cat_1_val &&
            Object.values(item)[1] === cat_2_val
        );
        return entry ? Object.values(entry)[0] : 0;
      }),
      name: cat_2_val,
      legendgroup: "cat_2",
      showlegend: true,
      ...(i === 0 && { legendgrouptitle: { text: legendGroupTitle } }),
      type: "bar",
      orientation: orientation === "h" ? "h" : undefined,
    }));
  } else if (type === "num_n_cat_1_temp_0") {
    const keys = Object.keys(data[0]);
    const cat = data.map((item) => Object.values(item)[keys.length - 1]);
    const metrics = keys.slice(0, keys.length - 1);

    return metrics.map((metric) => ({
      [orientation === "v" ? "x" : "y"]: cat,
      [orientation === "v" ? "y" : "x"]: data.map((item) => item[metric]),
      name: metric,
      type: "bar",
      orientation: orientation === "h" ? "h" : undefined,
    }));
  }
};

const BarChart = ({ typeString, dataset }) => {
  const type = typeString;
  const mockData = dataset;
  const charts = [];

  if (type === "num_1_cat_1_temp_0" || type === "num_1_cat_0_temp_1") {
    const [yKey, xKey] = Object.keys(mockData[0]);
    const x = mockData.map((item) => Object.values(item)[1]);
    const y = mockData.map((item) => Object.values(item)[0]);

    charts.push({
      title: "Basic Bar Chart",
      xAxisTitle: xKey,
      yAxisTitle: yKey,
      data: [{ x, y, type: "bar" }],
    });

    charts.push({
      title: "Horizontal Basic Bar Chart",
      xAxisTitle: yKey,
      yAxisTitle: xKey,
      data: [{ x: y, y: x, type: "bar", orientation: "h" }],
    });
  } else if (
    type === "num_1_cat_2_temp_0" ||
    type === "num_1_cat_1_temp_1" ||
    type === "num_n_cat_1_temp_0"
  ) {
    charts.push({
      title: "Grouped Bar Chart",
      xAxisTitle: generateGroupedOrStackedAxis(type, "x", mockData, "v"),
      yAxisTitle: generateGroupedOrStackedAxis(type, "y", mockData, "v"),
      data: generateGroupedOrStackedData(type, mockData, "v"),
      barmode: "group",
    });

    charts.push({
      title: "Stacked Bar Chart",
      xAxisTitle: generateGroupedOrStackedAxis(type, "x", mockData, "v"),
      yAxisTitle: generateGroupedOrStackedAxis(type, "y", mockData, "v"),
      data: generateGroupedOrStackedData(type, mockData, "v"),
      barmode: "stack",
    });

    charts.push({
      title: "Horizontal Stacked Bar Chart",
      xAxisTitle: generateGroupedOrStackedAxis(type, "x", mockData, "h"),
      yAxisTitle: generateGroupedOrStackedAxis(type, "y", mockData, "h"),
      data: generateGroupedOrStackedData(type, mockData, "h"),
      barmode: "stack",
    });

    charts.push({
      title: "Horizontal Grouped Bar Chart",
      xAxisTitle: generateGroupedOrStackedAxis(type, "x", mockData, "h"),
      yAxisTitle: generateGroupedOrStackedAxis(type, "y", mockData, "h"),
      data: generateGroupedOrStackedData(type, mockData, "h"),
      barmode: "group",
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
            barmode: chart.barmode,
          }}
        />
      ))}
    </div>
  );
};

export default BarChart;