import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import { Outlet } from "react-router-dom";

const Principal = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header
          open={open}
          toggleDrawer={toggleDrawer}
        />
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            transition: "margin-left 0.3s",
            marginLeft: open ? "240px" : "64px",
          }}
        >
          {/* <Dashboard /> */}
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default Principal;
