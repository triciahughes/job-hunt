import React from "react";
import PieChart from "../charts/pieChart";

const addStats = ({ data }: { data: any }) => {
  return <PieChart data={data} />;
};

export default addStats;
