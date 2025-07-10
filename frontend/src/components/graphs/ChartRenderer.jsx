import React from "react";
import Plot from "react-plotly.js";

export default function ChartRenderer({ data, state }) {
  console.log("ChartRenderer called with:", { data, state });
  
  if (!data || !state) {
    console.log("ChartRenderer: Missing data or state");
    return null;
  }

  const { 
    graph_type, 
    x_label, 
    y_label, 
    legend_label, 
    title, 
    color,
    use_multiple_colors,
    colors 
  } = state;

  // Default colors for multiple categories
  const defaultColors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ffa500", "#800080"];

  // Auto-detect and map data format
  let processedData = data;
  if (Array.isArray(data) && data.length > 0) {
    const firstItem = data[0];
    const keys = Object.keys(firstItem);
    
    // If data doesn't have x/y format, try to auto-map
    if (!('x' in firstItem && 'y' in firstItem)) {
      // Find string column (for labels) and number column (for values)
      let xKey = keys.find(k => typeof firstItem[k] === 'string');
      let yKey = keys.find(k => typeof firstItem[k] === 'number');
      
      if (xKey && yKey) {
        processedData = data.map(d => ({ x: d[xKey], y: d[yKey] }));
        console.log("Mapped data:", processedData); // Debug log
      }
    }
  }

  let plotData = [];
  let layout = {
    title: title || "Generated Graph",
    xaxis: { 
      title: x_label || "X Axis",
      showgrid: true,
      gridcolor: "#f0f0f0"
    },
    yaxis: { 
      title: y_label || "Y Axis",
      showgrid: true,
      gridcolor: "#f0f0f0"
    },
    legend: { 
      title: { text: legend_label || "Legend" },
      x: 0.5,
      y: -0.2,
      xanchor: "center",
      orientation: "h"
    },
    autosize: true,
    margin: { l: 60, r: 30, t: 60, b: 80 },
    plot_bgcolor: "white",
    paper_bgcolor: "white",
    font: { size: 12 }
  };

  switch (graph_type) {
    case "bar":
      plotData = [
        {
          x: processedData.map(d => d.x),
          y: processedData.map(d => d.y),
          type: "bar",
          marker: { 
            color: use_multiple_colors ? (colors || defaultColors) : (color || "#3366cc"),
            line: { color: "#333", width: 1 }
          },
          name: legend_label || "Data",
          text: processedData.map(d => d.y),
          textposition: "auto",
        },
      ];
      break;

    case "scatter":
      plotData = [
        {
          x: processedData.map(d => d.x),
          y: processedData.map(d => d.y),
          mode: "markers",
          type: "scatter",
          marker: { 
            color: color || "#3366cc",
            size: 8,
            line: { color: "#333", width: 1 }
          },
          name: legend_label || "Data",
        },
      ];
      break;

    case "pie":
      plotData = [
        {
          labels: processedData.map(d => d.x),
          values: processedData.map(d => d.y),
          type: "pie",
          marker: { 
            colors: use_multiple_colors ? (colors || defaultColors) : [color || "#3366cc"],
            line: { color: "#333", width: 2 }
          },
          name: legend_label || "Data",
          textinfo: "label+percent",
          textposition: "outside",
        },
      ];
      break;

    case "area":
      plotData = [
        {
          x: processedData.map(d => d.x),
          y: processedData.map(d => d.y),
          type: "scatter",
          mode: "lines",
          fill: "tonexty",
          fillcolor: color || "#3366cc",
          line: { color: color || "#3366cc", width: 2 },
          name: legend_label || "Data",
        },
      ];
      break;

    case "histogram":
      plotData = [
        {
          x: processedData.map(d => d.y),
          type: "histogram",
          marker: { 
            color: color || "#3366cc",
            line: { color: "#333", width: 1 }
          },
          name: legend_label || "Data",
          nbinsx: Math.min(20, processedData.length),
        },
      ];
      break;

    case "candlestick":
      // Expecting processedData to have open, high, low, close, and x (date/time)
      plotData = [
        {
          x: processedData.map(d => d.x),
          open: processedData.map(d => d.open),
          high: processedData.map(d => d.high),
          low: processedData.map(d => d.low),
          close: processedData.map(d => d.close),
          type: "candlestick",
          name: legend_label || "Data",
        },
      ];
      break;

    case "boxplot":
    case "box":
      // Expecting processedData to have y values (and optionally x for grouping)
      plotData = [
        {
          y: processedData.map(d => d.y),
          x: processedData[0] && processedData[0].x !== undefined ? processedData.map(d => d.x) : undefined,
          type: "box",
          name: legend_label || "Data",
          marker: { color: color || "#3366cc" },
          boxpoints: "all",
          jitter: 0.5,
          whiskerwidth: 0.2,
        },
      ];
      break;

    case "line":
    default:
      plotData = [
        {
          x: processedData.map(d => d.x),
          y: processedData.map(d => d.y),
          type: "scatter",
          mode: "lines+markers",
          marker: { 
            color: color || "#3366cc",
            size: 6,
            line: { color: "#333", width: 1 }
          },
          line: { color: color || "#3366cc", width: 2 },
          name: legend_label || "Data",
        },
      ];
      break;
  }

  console.log("Plot data:", plotData);
  console.log("Layout:", layout);

  return (
    <Plot
      data={plotData}
      layout={layout}
      style={{ width: "100%", height: "400px" }}
      useResizeHandler={true}
      config={{ 
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
        displaylogo: false
      }}
    />
  );
}