import React from "react";
import Graph from "./Graph";

const GraphTestPage = () => {
  // Test data for different scenarios
  const testScenarios = [
    {
      name: "Basic Line Chart",
      props: {
        num_numeric: 2,
        num_cat: 1,
        num_temporal: 1,
        types: JSON.stringify({
          recommended_graphs: ["Line Chart", "Bar Chart", "Area Chart"],
        }),
        data: [
          { date: "2023-01-01", value: 100, category: "A" },
          { date: "2023-01-02", value: 120, category: "B" },
          { date: "2023-01-03", value: 90, category: "A" },
          { date: "2023-01-04", value: 150, category: "B" },
        ],
      },
    },
    {
      name: "Financial Data (Candlestick)",
      props: {
        num_numeric: 4,
        num_cat: 0,
        num_temporal: 1,
        types: JSON.stringify({
          recommended_graphs: ["Candlestick Chart", "Line Chart", "Area Chart"],
        }),
        data: [
          { date: "2023-01-01", open: 100, high: 110, low: 95, close: 105 },
          { date: "2023-01-02", open: 105, high: 115, low: 100, close: 112 },
          { date: "2023-01-03", open: 112, high: 120, low: 108, close: 118 },
        ],
      },
    },
    {
      name: "Categorical Data (Pie Chart)",
      props: {
        num_numeric: 1,
        num_cat: 1,
        num_temporal: 0,
        types: JSON.stringify({
          recommended_graphs: ["Pie Chart", "Bar Chart", "Histogram"],
        }),
        data: [
          { category: "Category A", value: 25 },
          { category: "Category B", value: 35 },
          { category: "Category C", value: 20 },
          { category: "Category D", value: 20 },
        ],
      },
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Graph Component Tests</h1>

      {testScenarios.map((scenario, index) => (
        <div
          key={index}
          style={{
            marginBottom: "40px",
            border: "1px solid #ccc",
            padding: "20px",
          }}
        >
          <h2>{scenario.name}</h2>
          <p>Props: {JSON.stringify(scenario.props, null, 2)}</p>
          <Graph {...scenario.props} />
        </div>
      ))}

      {/* Test error cases */}
      <div
        style={{
          marginBottom: "40px",
          border: "1px solid #red",
          padding: "20px",
        }}
      >
        <h2>Error Case: Invalid Types</h2>
        <Graph
          num_numeric={1}
          num_cat={1}
          num_temporal={0}
          types="invalid json"
          data={[]}
        />
        <p>Should render nothing</p>
      </div>
    </div>
  );
};

export default GraphTestPage;
