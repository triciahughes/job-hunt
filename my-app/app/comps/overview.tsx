"use client";
import React, { useState, useEffect } from "react";
import OverviewChart from "../charts/overviewChart";

export default function Overview() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    fetch("http://localhost:3000/api", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setData(data.data.map((d: any) => d).slice(3));
      });
  };

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
