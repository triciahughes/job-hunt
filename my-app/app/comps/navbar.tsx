"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function Navbar() {
  const [value, setValue] = useState(0);

  // MUI Tabs' onChange handler provides an event of type React.ChangeEvent<{}> and a new value.
  // So we specify these types for our handleChange function.
  const handleChange = (e: React.ChangeEvent<{}>, newValue: number) => {
    setValue(() => newValue);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Item One" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
      </Tabs>
    </Box>
  );
}
