import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Alert,
  AlertTitle,
} from "@mui/material";
import Header from "./header";
import Sidenav from "./sidenav";
import { UserContext } from "../Context";
import AlertNotification from "../Components/Alert";

const Layout = () => {
  const alerts = useSelector((state) => state.value);
  const userInfo = useContext(UserContext);

  const alertsList = alerts.map((value, index) => (
    <AlertNotification key={`alert-${index}`} value={value} />
  ));

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header />
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {alertsList}
        <Toolbar />
        {userInfo && <Outlet />}
        {!userInfo && (
          <Alert severity="warning" variant="outlined">
            <AlertTitle>Please login with Discord!</AlertTitle>
            <Typography variant="body">
              ModForge requires that all users first be logged in with Discord
              before interacting with application.
            </Typography>
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default Layout;
