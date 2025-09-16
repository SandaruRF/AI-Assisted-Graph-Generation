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
    color
  } = state;

  console.log("ChartRenderer extracted values:", { 
    graph_type, 
    x_label, 
    y_label, 
    legend_label, 
    title, 
    color 
  });

  console.log("ChartRenderer x_label value:", x_label);
  console.log("ChartRenderer y_label value:", y_label);

  // Single color mode only

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
    title: {
      text: title || undefined,
      font: {
        size: 18,
        color: "#333333"
      },
      x: 0.5,
      xanchor: "center",
      y: 0.95,
      yanchor: "top"
    },
    xaxis: { 
      title: {
        text: x_label || undefined,
        font: {
          size: 14,
          color: "#333333"
        },
        standoff: 20
      },
      showgrid: true,
      gridcolor: "#f0f0f0",
      tickfont: {
        size: 12,
        color: "#666666"
      }
    },
    yaxis: { 
      title: {
        text: y_label || undefined,
        font: {
          size: 14,
          color: "#333333"
        },
        standoff: 20
      },
      showgrid: true,
      gridcolor: "#f0f0f0",
      tickfont: {
        size: 12,
        color: "#666666"
      }
    },
    legend: { 
      title: { text: legend_label || undefined },
      x: 0.5,
      y: -0.2,
      xanchor: "center",
      orientation: "h"
    },
    autosize: true,
    margin: { l: 60, r: 30, t: 80, b: 80 }, // Increased top margin for title
    plot_bgcolor: "white",
    paper_bgcolor: "white",
    font: { size: 12 }
  };

  console.log("ChartRenderer layout:", layout); // Debug log
  console.log("ChartRenderer xaxis title:", layout.xaxis.title); // Debug log
  console.log("ChartRenderer yaxis title:", layout.yaxis.title); // Debug log

  switch (graph_type) {
    case "bar":
      plotData = [
        {
          x: processedData.map(d => d.x),
          y: processedData.map(d => d.y),
          type: "bar",
          marker: { 
            color: color !== undefined ? color : undefined,
            line: { color: "#333", width: 1 }
          },
          name: legend_label,
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
            color: color !== undefined ? color : undefined,
            size: 8,
            line: { color: "#333", width: 1 }
          },
          name: legend_label,
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
            colors: color !== undefined ? [color] : undefined,
            line: { color: "#333", width: 2 }
          },
          name: legend_label,
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
          fillcolor: color !== undefined ? color : undefined,
          line: { color: color !== undefined ? color : undefined, width: 2 },
          name: legend_label,
        },
      ];
      break;

    case "histogram":
      plotData = [
        {
          x: processedData.map(d => d.y),
          type: "histogram",
          marker: { 
            color: color !== undefined ? color : undefined,
            line: { color: "#333", width: 1 }
          },
          name: legend_label,
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
          name: legend_label,
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
          name: legend_label,
          marker: { color: color !== undefined ? color : undefined },
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
            color: color !== undefined ? color : undefined,
            size: 6,
            line: { color: "#333", width: 1 }
          },
          line: { color: color !== undefined ? color : undefined, width: 2 },
          name: legend_label,
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
      style={{ width: "100%", height: "500px" }} // Increased height to accommodate title
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