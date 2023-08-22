"use client";
import React from "react";
import OverviewChart from "../charts/overviewChart";

export default function Overview({ data }: { data: any }) {
  return (
    <div>
      <h1
        style={{
          padding: 15,
          textAlign: "center",
          fontFamily: "Sans-serif",
          fontWeight: 400,
        }}
      >
        Application Status Overview
      </h1>
      <OverviewChart data={data} />
    </div>
  );
}
