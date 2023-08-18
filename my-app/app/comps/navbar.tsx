"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Overview from "./overview";

export default function Navbar() {
  const [value, setValue] = useState(0);

  // MUI Tabs' onChange handler provides an event of type React.ChangeEvent<{}> and a new value.
  // So we specify these types for our handleChange function.
  const handleChange = (e: React.ChangeEvent<{}>, newValue: number) => {
    setValue(() => newValue);
  };

  const handleTabView = () => {
    if (value === 0) {
      return <Overview />;
    } else if (value === 1) {
      return <div>?</div>;
    } else if (value === 2) {
      return <div>About Me</div>;
    }
  };

  return (
    <>
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Overview" />
          <Tab label="?" />
          <Tab label="About Me" />
        </Tabs>
      </Box>
      {handleTabView()}
    </>
  );
}
