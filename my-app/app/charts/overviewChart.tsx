"use client";
import React, { useRef, useEffect, Key } from "react";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";

const ChartConfig = {
  width: window.innerWidth * 0.9,
  height: 700,
};

interface ApplicationData {
  source: string;
  target: string;
}

interface SankeyNode {
  name: string;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

interface HandleChartProps {
  data: (string | boolean)[][];
}

export default function D3Chart({ data }: HandleChartProps) {
  const ref = useRef<SVGSVGElement>(null);

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

    const sankeyData = transformToSankeyData(applicationData);

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
      .attr("x", (d: any) => (isNaN(d.x0) ? 0 : d.x0))
      .attr("y", (d: any) => (isNaN(d.y0) ? 0 : d.y0))
      .attr("height", (d: any) => (isNaN(d.y1 - d.y0) ? 0 : d.y1 - d.y0))

      .attr("width", (d: any) => (isNaN(d.x1 - d.x0) ? 0 : d.x1 - d.x0))
      .attr("stroke", "none")
      .attr("stroke-width", 2)
      .attr("fill", "purple");
  }, [data]);

  return (
    <div style={{ marginLeft: 50 }}>
      <svg ref={ref} style={{ border: "1px solid black" }}></svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 15,
          marginLeft: 15,
          fontFamily: "Sans-serif",
          maxWidth: window.innerWidth * 0.88,
        }}
      >
        <h3>
          Total Applications:{" "}
          <span style={{ color: "purple" }}>{totalApplications}</span>
        </h3>
        <h3>
          Total Rejections:{" "}
          <span style={{ color: "#ea4335" }}>{totalRejections}</span>
        </h3>
        <h3>
          Total Technical Challenges:{" "}
          <span style={{ color: "#fbbc05" }}>{totalTechnical}</span>
        </h3>
      </div>
    </div>
  );
}
