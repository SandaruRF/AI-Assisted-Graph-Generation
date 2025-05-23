import React from "react";
import Plot from "react-plotly.js";

const mockData1 = [
  { CustomerAge: 18 },
  { CustomerAge: 21 },
  { CustomerAge: 23 },
  { CustomerAge: 25 },
  { CustomerAge: 26 },
  { CustomerAge: 27 },
  { CustomerAge: 28 },
  { CustomerAge: 30 },
  { CustomerAge: 31 },
  { CustomerAge: 33 },
  { CustomerAge: 35 },
  { CustomerAge: 36 },
  { CustomerAge: 37 },
  { CustomerAge: 38 },
  { CustomerAge: 39 },
  { CustomerAge: 40 },
  { CustomerAge: 42 },
  { CustomerAge: 45 },
  { CustomerAge: 47 },
  { CustomerAge: 50 },
  { CustomerAge: 52 },
  { CustomerAge: 55 },
  { CustomerAge: 60 },
  { CustomerAge: 65 },
  { CustomerAge: 70 },
];

const mockData2 = [
  { Salary: 35000, Gender: "Male" },
  { Salary: 42000, Gender: "Male" },
  { Salary: 39000, Gender: "Male" },
  { Salary: 47000, Gender: "Male" },
  { Salary: 50000, Gender: "Male" },
  { Salary: 38000, Gender: "Female" },
  { Salary: 41000, Gender: "Female" },
  { Salary: 45000, Gender: "Female" },
  { Salary: 47000, Gender: "Female" },
  { Salary: 52000, Gender: "Female" },
  { Salary: 36000, Gender: "Other" },
  { Salary: 40000, Gender: "Other" },
  { Salary: 43000, Gender: "Other" },
  { Salary: 46000, Gender: "Other" },
  { Salary: 49000, Gender: "Other" },
];

const mockData3 = [
  { Sales: 120, Date: "2023-01-05" },
  { Sales: 150, Date: "2023-01-12" },
  { Sales: 170, Date: "2023-01-22" },
  { Sales: 180, Date: "2023-02-03" },
  { Sales: 160, Date: "2023-02-10" },
  { Sales: 200, Date: "2023-02-25" },
  { Sales: 220, Date: "2023-03-04" },
  { Sales: 210, Date: "2023-03-15" },
  { Sales: 230, Date: "2023-03-20" },
  { Sales: 250, Date: "2023-03-28" },
  { Sales: 270, Date: "2023-04-05" },
  { Sales: 300, Date: "2023-04-18" },
  { Sales: 310, Date: "2023-04-27" },
  { Sales: 280, Date: "2023-05-03" },
  { Sales: 260, Date: "2023-05-11" },
  { Sales: 290, Date: "2023-05-20" },
  { Sales: 305, Date: "2023-05-29" },
  { Sales: 330, Date: "2023-06-02" },
  { Sales: 340, Date: "2023-06-10" },
  { Sales: 360, Date: "2023-06-18" },
  { Sales: 370, Date: "2023-06-25" },
];

const mockData4 = [
  { ClassA: 78, ClassB: 81, ClassC: 85, ClassD: 90 },
  { ClassA: 85, ClassB: 79, ClassC: 88, ClassD: 84 },
  { ClassA: 90, ClassB: 84, ClassC: 92, ClassD: 89 },
  { ClassA: 88, ClassB: 82, ClassC: 86, ClassD: 87 },
  { ClassA: 76, ClassB: 77, ClassC: 80, ClassD: 81 },
  { ClassA: 92, ClassB: 88, ClassC: 91, ClassD: 93 },
  { ClassA: 81, ClassB: 85, ClassC: 83, ClassD: 86 },
  { ClassA: 87, ClassB: 83, ClassC: 85, ClassD: 88 },
  { ClassA: 74, ClassB: 76, ClassC: 79, ClassD: 80 },
  { ClassA: 95, ClassB: 90, ClassC: 97, ClassD: 94 },
  { ClassA: 89, ClassB: 86, ClassC: 90, ClassD: 93 },
  { ClassA: 84, ClassB: 80, ClassC: 82, ClassD: 85 },
  { ClassA: 77, ClassB: 78, ClassC: 76, ClassD: 79 },
  { ClassA: 82, ClassB: 81, ClassC: 83, ClassD: 84 },
  { ClassA: 91, ClassB: 87, ClassC: 90, ClassD: 92 },
  { ClassA: 80, ClassB: 79, ClassC: 78, ClassD: 80 },
  { ClassA: 86, ClassB: 84, ClassC: 88, ClassD: 87 },
  { ClassA: 93, ClassB: 89, ClassC: 94, ClassD: 92 },
  { ClassA: 75, ClassB: 77, ClassC: 76, ClassD: 78 },
  { ClassA: 79, ClassB: 80, ClassC: 81, ClassD: 85 },
];

const mockData5 = [
  { Country: "USA" },
  { Country: "USA" },
  { Country: "Canada" },
  { Country: "USA" },
  { Country: "UK" },
  { Country: "Germany" },
  { Country: "Canada" },
  { Country: "UK" },
  { Country: "Germany" },
  { Country: "Canada" },
  { Country: "India" },
  { Country: "India" },
  { Country: "USA" },
  { Country: "Canada" },
  { Country: "UK" },
];

// num_1_cat_0_temp_0  --  mockData1
// num_1_cat_1_temp_0  --  mockData2
// num_1_cat_0_temp_1  --  mockData3
// num_n_cat_0_temp_0  --  mockData4
// num_0_cat_1_temp_0  --  mockData5



const Histogram = ({ typeString, dataset, colors, xLabel, yLabel, legendLabels }) => {
  const type = typeString;
  const mockData = dataset;
  if (!mockData || mockData.length === 0) return null;

  const charts = [];
  const opacity = 0.7;
  const getLegendName = (name) => legendLabels?.[name] || name;
  const getColor = (index) => (colors && colors[index]) || undefined;

  let data, data1, data2, data3 = [];
  let title, title1, barmode, barmode1;
  let xKey, yKey, yKey1, categoryKey, categoryKey1, timeKey = "";

  if (type === "num_1_cat_0_temp_0") {
    [xKey] = Object.keys(mockData[0]);
    yKey = yLabel || "Frequency";
    yKey1 = "Probability";
    const totalItems = mockData.length;

    data = [{ x: mockData.map((item) => item[xKey]), type: "histogram", opacity }];
    data1 = [{ y: mockData.map((item) => item[xKey]), type: "histogram", opacity }];
    data2 = [{ x: mockData.map((item) => item[xKey]), type: "histogram", opacity, histnorm: "probability" }];
    data3 = [{ y: mockData.map((item) => item[xKey]), type: "histogram", opacity, histnorm: "probability" }];

    title = "Basic Histogram";
    title1 = "Normalized Histogram";

    charts.push({ data, title, xKey, yKey });
    charts.push({ data: data1, title, yKey: xKey, xKey: yKey });
    charts.push({ data: data2, title: title1, xKey, yKey: yKey1 });
    charts.push({ data: data3, title: title1, yKey: xKey, xKey: yKey1 });
  }

  else if (type === "num_1_cat_1_temp_0") {
    [xKey, categoryKey] = Object.keys(mockData[0]);
    yKey = yLabel || "Frequency";
    const categories = [...new Set(mockData.map((item) => item[categoryKey]))];

    data = categories.map((category, i) => ({
      x: mockData.filter(item => item[categoryKey] === category).map(item => item[xKey]),
      type: "histogram",
      opacity,
      name: getLegendName(category),
      marker: { color: getColor(i) },
      showlegend: true,
      ...(i === 0 && { legendgrouptitle: { text: getLegendName(categoryKey) } }),
    }));

    data1 = categories.map((category, i) => ({
      y: mockData.filter(item => item[categoryKey] === category).map(item => item[xKey]),
      type: "histogram",
      opacity,
      name: getLegendName(category),
      marker: { color: getColor(i) },
      showlegend: true,
      ...(i === 0 && { legendgrouptitle: { text: getLegendName(categoryKey) } }),
    }));

    title = "Grouped Histogram";
    title1 = "Grouped Stacked Histogram";
    barmode = "overlay";
    barmode1 = "stack";

    charts.push({ data, title, barmode, xKey, yKey });
    charts.push({ data: data1, title, barmode, yKey: xKey, xKey: yKey });
    charts.push({ data, title: title1, barmode: barmode1, xKey, yKey });
    charts.push({ data: data1, title: title1, barmode: barmode1, yKey: xKey, xKey: yKey });
  }

  else if (type === "num_1_cat_0_temp_1") {
    [yKey, xKey] = Object.keys(mockData[0]);

    data = [{
      x: mockData.map(item => item[xKey]),
      y: mockData.map(item => item[yKey]),
      type: "bar",
      opacity
    }];

    title = "Time-Based Histogram";
    charts.push({ data, title, xKey, yKey });
  }

  else if (type === "num_n_cat_0_temp_0") {
    const numerics = Object.keys(mockData[0]);
    yKey = yLabel || "Frequency";

    data = numerics.map((numKey, i) => ({
      x: mockData.map(item => item[numKey]),
      type: "histogram",
      name: getLegendName(numKey),
      marker: { color: getColor(i) },
      showlegend: true,
      opacity,
      ...(i === 0 && { legendgrouptitle: { text: "Fields" } }),
    }));

    data1 = numerics.map((numKey, i) => ({
      y: mockData.map(item => item[numKey]),
      type: "histogram",
      name: getLegendName(numKey),
      marker: { color: getColor(i) },
      showlegend: true,
      opacity,
      ...(i === 0 && { legendgrouptitle: { text: "Fields" } }),
    }));

    title = "Multi-Numeric Histogram";
    title1 = "Stacked Histogram";
    barmode = "overlay";
    barmode1 = "stack";

    charts.push({ data, title, barmode, xKey: "Value", yKey });
    charts.push({ data: data1, title, barmode, xKey: yKey, yKey: "Value" });
    charts.push({ data, title: title1, barmode: barmode1, xKey: "Value", yKey });
    charts.push({ data: data1, title: title1, barmode: barmode1, xKey: yKey, yKey: "Value" });
  }

  else if (type === "num_0_cat_1_temp_0") {
    [categoryKey] = Object.keys(mockData[0]);
    yKey = yLabel || "Count";
    const categories = [...new Set(mockData.map(item => item[categoryKey]))];

    data = categories.map((category, i) => ({
      x: mockData.filter(item => item[categoryKey] === category).map(item => item[categoryKey]),
      type: "histogram",
      name: getLegendName(category),
      marker: { color: getColor(i) },
      showlegend: false,
      opacity,
    }));

    data1 = categories.map((category, i) => ({
      y: mockData.filter(item => item[categoryKey] === category).map(item => item[categoryKey]),
      type: "histogram",
      name: getLegendName(category),
      marker: { color: getColor(i) },
      showlegend: false,
      opacity,
    }));

    title = "Categorical Histogram";
    barmode = "overlay";

    charts.push({ data, title, barmode, xKey: categoryKey, yKey });
    charts.push({ data: data1, title, barmode, yKey: categoryKey, xKey: yKey });
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
            xaxis: { title: { text: xLabel || chart.xKey } },
            yaxis: { title: { text: yLabel || chart.yKey } },
            barmode: chart.barmode,
          }}
        />
      ))}
    </div>
  );
};




export default Histogram;
