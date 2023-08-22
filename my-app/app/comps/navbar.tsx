"use client";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Overview from "./overview";
import AddStats from "./addStats";

export default function Navbar() {
  const [value, setValue] = useState(0);
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

  // MUI Tabs' onChange handler provides an event of type React.ChangeEvent<{}> and a new value.
  // So we specify these types for our handleChange function.
  const handleChange = (e: React.ChangeEvent<{}>, newValue: number) => {
    setValue(() => newValue);
  };

  const handleTabView = () => {
    if (value === 0) {
      return <Overview data={data} />;
    } else if (value === 1) {
      return <AddStats data={data} />;
    } else if (value === 2) {
      return <div>About Me</div>;
    }
  };

  return (
    <>
      <Box sx={{ width: "100%", bgcolor: "black" }}>
        <Tabs value={value} onChange={handleChange} centered textColor='White'>
          <Tab label='Overview' />
          <Tab label='Additional Stats' />
          <Tab label='About Me' />
        </Tabs>
      </Box>
      {handleTabView()}
    </>
  );
}
