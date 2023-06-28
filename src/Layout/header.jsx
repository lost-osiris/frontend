import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/authprovider";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  AppBar,
  Typography,
  Toolbar,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import Logout from "@mui/icons-material/Logout";
import * as utils from "../utils";

const AUTH_REDIRECT =
  process.env.REACT_APP_IS_DEV === "true"
    ? encodeURI("http://localhost:3000/")
    : encodeURI("https://modforge.gg/");

const Header = () => {
  const userInfo = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    localStorage.removeItem("userInfo");
    window.location = "/";
  };

  useEffect(() => {
    if (!categories[0]) {
      utils
        .requests("get", `/api/project/Pale-Court/categories`)
        .then((data) => setCategories(data));
    }
  }, [categories]);

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Fab size="small" onClick={() => (window.location.href = "/")}>
          <HomeIcon />
        </Fab>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl: 1 }}>
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
            <Fab
              color="discord"
              variant="circular"
              // onClick={() => navigate(`/user/${userInfo.data.discord_id}`)}
              onClick={handleClick}
            >
              <Avatar
                src={`https://cdn.discordapp.com/avatars/${userInfo.data.discord_id}/${userInfo.data.avatar}.png`}
                alt={userInfo.data.username}
                sx={{ width: 50, height: 50 }}
              />
            </Fab>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  width: 250,
                  height: 50,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 23,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose}>
                <Avatar
                  src={`https://cdn.discordapp.com/avatars/${userInfo.data.discord_id}/${userInfo.data.avatar}.png`}
                  alt={userInfo.data.username}
                  sx={{ width: 50, height: 50 }}
                  onClick={handleClick}
                />{" "}
                Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <div>
            <Fab
              color="discord"
              variant="extended"
              href={`https://discord.com/api/oauth2/authorize?client_id=1074939657902637058&redirect_uri=${AUTH_REDIRECT}&response_type=code&scope=identify`}
            >
              Discord Login
              <LoginIcon sx={{ pl: 0.5 }} />
            </Fab>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
