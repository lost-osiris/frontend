import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/authprovider.component";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import axios from "axios";

import {
  Avatar,
  Box,
  Drawer,
  AppBar,
  CssBaseline,
  List,
  Typography,
  ListItemButton,
  ListItem,
  ListItemText,
  Toolbar,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const drawerWidth = 240;
const theme = createTheme({
  palette: {
    discord: {
      main: "#5865F2",
    },
  },
});

const AUTH_REDIRECT =
  process.env.REACT_APP_IS_DEV === "true"
    ? encodeURI("http://localhost:3000/")
    : encodeURI("https://issue-tracker-front.vercel.app/");

export const Header = () => {
  const userInfo = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!categories[0]) {
      axios
        .get(`/api/project/Pale-Court/categories`)
        .then((res) => setCategories(res.data));
    }
  }, [categories]);

  if (location.pathname.includes("/projects")) {
    return (
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Fab size="small" onClick={() => navigate("/")}>
              <HomeIcon />
            </Fab>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, pl: 1 }}
            >
              Project Management
            </Typography>

            <Fab
              variant="extended"
              onClick={() => navigate("/form")}
              sx={{ margin: 1 }}
            >
              Project
              <AddIcon />
            </Fab>
            {userInfo ? (
              <ThemeProvider theme={theme}>
                <Fab
                  color="discord"
                  variant="circular"
                  onClick={() => navigate(`/user/${userInfo.id}`)}
                >
                  <Avatar
                    src={`https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`}
                    alt={userInfo.username}
                    sx={{ width: 50, height: 50 }}
                  />
                </Fab>
              </ThemeProvider>
            ) : (
              <ThemeProvider theme={theme}>
                <Fab
                  color="discord"
                  variant="extended"
                  href={`https://discord.com/api/oauth2/authorize?client_id=1074939657902637058&redirect_uri=${AUTH_REDIRECT}&response_type=code&scope=identify`}
                >
                  Discord Login
                  <LoginIcon sx={{ pl: 0.5 }} />
                </Fab>
              </ThemeProvider>
            )}
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    );
  } else {
    return (
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Fab size="small" onClick={() => navigate("/")}>
              <HomeIcon />
            </Fab>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, pl: 1 }}
            >
              Project Management
            </Typography>

            {userInfo ? (
              <div>
                <Fab
                  variant="extended"
                  onClick={() => navigate("/form")}
                  sx={{ margin: 1 }}
                >
                  Issue
                  <AddIcon sx={{ pl: 0.5 }} />
                </Fab>
                <ThemeProvider theme={theme}>
                  <Fab
                    color="discord"
                    variant="circular"
                    onClick={() => navigate(`/user/${userInfo.id}`)}
                  >
                    <Avatar
                      src={`https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`}
                      alt={userInfo.username}
                      sx={{ width: 50, height: 50 }}
                    />
                  </Fab>
                </ThemeProvider>
              </div>
            ) : (
              <div>
                <ThemeProvider theme={theme}>
                  <Fab
                    color="discord"
                    variant="extended"
                    href={`https://discord.com/api/oauth2/authorize?client_id=1074939657902637058&redirect_uri=${AUTH_REDIRECT}&response_type=code&scope=identify`}
                  >
                    Discord Login
                    <LoginIcon sx={{ pl: 0.5 }} />
                  </Fab>
                </ThemeProvider>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {categories.map((el, index) => {
                return (
                  <ListItem
                    disablePadding
                    key={el.route}
                    onClick={() => navigate(`/issues/${el.toLowerCase()}`)}
                  >
                    <ListItemButton>
                      <ListItemText primary={el} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    );
  }
};
