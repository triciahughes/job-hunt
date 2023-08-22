import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const ChartConfig = {
  width: 400,
  height: 400,
  radius: 200,
};

const pieChartColors = [
  //   "#ffffff",
  //   "#607d8b",
  //   "#9e9e9e",
  //   "#795548",
  //   "#ff5722",
  //   "#ff9800",
  //   "#ffc107",
  //   "#ffeb3b",
  //   "#cddc39",
  //   "#8bc34a",
  "#4caf50",
  "#009688",
  "#00bcd4",
  "#03a9f4",
  "#2196f3",
  "#3f51b5",
  "#673ab7",
  "#9c27b0",
  //   "#e91e63",
  //   "#f44336",
];

const PieChart = ({ data }: { data: any }) => {
  const ref = useRef<SVGSVGElement>(null);

  const jobSite = data.map((d: any) => (d[4] === "-" ? "Other" : d[4]));

  const uniqueSites = [...new Set(jobSite)];

  const counts = jobSite.reduce((acc: any, site: any) => {
    acc[site] = (acc[site] || 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    if (!data || data.length === 0) return;

    const pie = d3.pie();
    const arcs = pie(uniqueSites.map((d: any) => counts[d]));

    const colorScale = d3
      .scaleOrdinal()
      .domain(uniqueSites)
      .range(pieChartColors); // This is a default set of colors provided by D3. You can replace it with an array of your preferred colors.

    const arcGenerator = d3
      .arc()
      .innerRadius(0)
      .outerRadius(ChartConfig.radius);

    const svg = d3
      .select(ref.current)
      .attr("width", ChartConfig.width)
      .attr("height", ChartConfig.height);

    svg
      .selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arcGenerator as any)
      .attr("fill", (d: any) => colorScale(d.data)) // Assign colors from the scale based on data
      .attr(
        "transform",
        `translate(${ChartConfig.width / 2},${ChartConfig.height / 2})`
      );
  }, [data]);

  return (
    <>
      <div
        style={{
          marginTop: 50,
          marginLeft: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3 style={{ marginBottom: 20, textAlign: "center", marginRight: 45 }}>
          Job Sites
        </h3>
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg ref={ref}></svg>
          <div style={{ marginLeft: 15, paddingBottom: 5 }}>
            <h4>Site</h4>
            <h4>Site</h4>
            <h4>Site</h4>
            <h4>Site</h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default PieChart;
