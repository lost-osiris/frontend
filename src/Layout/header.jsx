import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../Context/authprovider";
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
import * as utils from "../Utils";

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
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    window.location = "/project/63fe47296edfc3b387628861/issues/general";
  };

  useEffect(() => {
    if (!categories) {
      utils
        .requests("get", `/api/project/63fe47296edfc3b387628861/categories`)
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
          ModForge
        </Typography>

        {userInfo ? (
          <div>
            <Fab
              variant="extended"
              onClick={() => navigate("/project/63fe47296edfc3b387628861/form")}
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
                src={`https://cdn.discordapp.com/avatars/${userInfo.user.discord_id}/${userInfo.user.avatar}.png`}
                alt={userInfo.user.username}
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
                  src={`https://cdn.discordapp.com/avatars/${userInfo.user.discord_id}/${userInfo.user.avatar}.png`}
                  alt={userInfo.username}
                  sx={{ width: 50, height: 50 }}
                  onClick={handleClick}
                />{" "}
                Profile
              </MenuItem>
              <MenuItem onClick={logout}>
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
              href={utils.AUTH_REDIRECT_URL}
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
