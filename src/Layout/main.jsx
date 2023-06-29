import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { Box, CssBaseline, Toolbar } from "@mui/material";
import Header from "./header";
import Sidenav from "./sidenav";
import Alert from "../Components/Alert";

const Layout = () => {
  const alerts = useSelector((state) => state.value);

  const alertsList = alerts.map((value, index) => (
    <Alert key={`alert-${index}`} value={value} />
  ));

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header />
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {alertsList}
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
