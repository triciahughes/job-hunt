"use client";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";

const ChartConfig = {
  width: window.innerWidth * 0.9,
  height: 700,
  //   color: "red",
};

interface HandleChartProps {
  data: any[];
}

export default function D3Chart({ data }: HandleChartProps) {
  const ref = useRef();
  //   console.log(data);

  const applicationData = data.map((d: any, index: number) => {
    return {
      source: `Application ${index + 1}`,
      target: d[3],
    };
  });

  const statusColors = {
    Applied: "purple",
    "Not Selected": "#ea4335",
    Interview: "#fbbc05",
    "Follow-up": "#fbbc05",
    Offer: "#4285f4",
  };

  const titles = data.map((d: any) => d[0]);
  const companies = data.map((d: any) => d[1]);
  const datesApplied = data.map((d: any) => d[2]);
  const applicationStatus = data.map((d: any) => d[3]);
  const jobSite = data.map((d: any) => d[4]);
  const technical = data.map((d: any) => d[5]);

  const totalApplications = data.map((d: any) => d).length;

  const totalRejections = data
    .map((d: any) => d[3])
    .slice(3)
    .filter((d: any) => d === "Not Selected").length;

  const totalTechnical = data
    .map((d: any) => d[5])
    .slice(3)
    .filter((d: any) => d === true).length;

  function transformToSankeyData(data: any) {
    const nodes = [];
    const links = {};

    // Extract unique nodes
    const nodeNames = Array.from(
      new Set([
        ...data.map((d: any) => d.source),
        ...data.map((d: any) => d.target),
      ])
    );

    // Create node objects and assign unique indices
    nodeNames.forEach((name: any) => {
      nodes.push({ name });
    });

    // Construct the links
    data.forEach((item: any) => {
      const sourceIndex = nodeNames.indexOf(item.source);
      const targetIndex = nodeNames.indexOf(item.target);
      const linkKey = `${sourceIndex}-${targetIndex}`;

      if (!links[linkKey]) {
        links[linkKey] = {
          source: sourceIndex,
          target: targetIndex,
          value: 0,
        };
      }

      links[linkKey].value++;
    });

    return {
      nodes: nodes,
      links: Object.values(links),
    };
  }

  useEffect(() => {
    if (!data || data.length === 0) return;

    // const sankeyData = {
    //   nodes: [
    //     { name: "A" },
    //     { name: "B" },
    //     { name: "C" },
    //     { name: "D" },
    //     { name: "E" },
    //   ],
    //   links: [
    //     { source: 0, target: 1, value: 1 },
    //     { source: 0, target: 2, value: 1 },
    //     { source: 1, target: 3, value: 1 },
    //     { source: 2, target: 3, value: 1 },
    //   ],
    // };

    const sankeyData = transformToSankeyData(applicationData);
    // console.log("Sankey Data:", JSON.stringify(sankeyData, null, 2));

    const svg = d3
      .select(ref.current)
      .attr("width", ChartConfig.width)
      .attr("height", ChartConfig.height);

    const sankeyGenerator = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([ChartConfig.width, ChartConfig.height]);
    const graph = sankeyGenerator(sankeyData);

    svg
      .append("g")
      .selectAll(".link")
      .data(graph.links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d: any) => statusColors[d.target.name] || "#0077b6")
      .attr("stroke-width", (d: any) => Math.max(1, d.width))
      .attr("fill", "none");

    // Add a single label for all links originating from "Applied"
    svg
      .append("text")
      .attr("x", window.innerWidth * 0.84)
      .attr("y", window.innerHeight * 0.3)
      .attr("dy", ".35em") // Adjust vertical alignment
      .text(`${totalApplications - totalRejections} Pending`)
      .style("font-size", "12px")
      .attr("fill", "white");

    // Add a single label for all links originating from "Not Selected"
    svg
      .append("text")
      .attr("x", window.innerWidth * 0.82)
      .attr("y", window.innerHeight * 0.52)
      .attr("dy", ".35em") // Adjust vertical alignment
      .text(`${totalRejections} Not Selected`)
      .style("font-size", "12px")
      .attr("fill", "white");

    // Add a single label for all links originating from "Interview / Follow-up"
    svg
      .append("text")
      .attr("x", window.innerWidth * 0.79)
      .attr("y", window.innerHeight * 0.765)
      .attr("dy", ".35em") // Adjust vertical alignment
      .text("Interview / Follow-up")
      .style("font-size", "12px")
      .attr("fill", "white");

    svg
      .append("g")
      .selectAll(".node")
      .data(graph.nodes)
      .enter()
      .append("rect")
      .attr("class", "node")
      .attr("x", (d) => (isNaN(d.x0) ? 0 : d.x0))
      .attr("y", (d) => (isNaN(d.y0) ? 0 : d.y0))
      .attr("height", (d) => (isNaN(d.y1 - d.y0) ? 0 : d.y1 - d.y0))

      .attr("width", (d) => (isNaN(d.x1 - d.x0) ? 0 : d.x1 - d.x0))
      .attr("stroke", "none")
      .attr("stroke-width", 2)
      .attr("fill", "none");
  }, [data]);

  return (
    <>
      <svg ref={ref} style={{ border: "1px solid black" }}></svg>
      <div>
        <h3>Total Applications: {totalApplications}</h3>
        <h3>Total Rejections: {totalRejections}</h3>
        <h3>Total Technical Challenges: {totalTechnical}</h3>
      </div>
    </>
  );
}
