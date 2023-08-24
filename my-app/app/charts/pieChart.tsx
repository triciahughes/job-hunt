import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const ChartConfig = {
  width: 400,
  height: 400,
  radius: 200,
};

const pieChartColors = [
  "#4caf50",
  "#009688",
  "#00bcd4",
  "#03a9f4",
  "#2196f3",
  "#3f51b5",
  "#673ab7",
  "#9c27b0",
];

const PieChart = ({ data }: { data: any }) => {
  const ref = useRef<SVGSVGElement>(null);

  const jobSite = data.map((d: any) => (d[4] === "-" ? "Other" : d[4]));

  const uniqueSites = [...new Set(jobSite)];

  const counts = jobSite.reduce((acc: any, site: any) => {
    acc[site] = (acc[site] || 0) + 1;
    return acc;
  }, {});

  const totalLi = counts["linkedin.com"];
  const totalWell = counts["wellfound.com"];
  const totalRemote = counts["remoterocketship.com"];
  const totalIndeed = counts["indeed.com"];

  const totalCompanySite =
    counts["apple.com"] +
    counts["gr8people.com"] +
    counts["ixl.com"] +
    counts["lever.co"];

  const totalOther =
    counts["Other"] +
    counts["consensys.net"] +
    counts["frameable.com"] +
    counts["greenhouse.io"] +
    counts["infinityward.com"] +
    counts["jobvite.com"] +
    counts["metacareers.com"] +
    counts["workable.com"] +
    counts["myworkdayjobs.com"] +
    counts["myworkdaysite.com"] +
    counts["reyrey.com"] +
    counts["workable.com"] +
    counts["ycombinator.com"];

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
          <div style={{ marginLeft: 15 }}>
            <h4 style={{ color: "#03a9f4" }}>{totalLi} LinkedIn</h4>
            <h4 style={{ color: "#9c27b0" }}>{totalWell} Wellfound</h4>
            <h4 style={{ color: "#4caf50" }}>{totalRemote} RemoteRocket</h4>
            <h4 style={{ color: "#009688" }}>{totalIndeed} Indeed</h4>
            <h4 style={{ color: "#673ab7" }}>
              {totalCompanySite} Company Site
            </h4>
            <h4 style={{ color: "#3f51b5" }}>{totalOther} Others</h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default PieChart;
