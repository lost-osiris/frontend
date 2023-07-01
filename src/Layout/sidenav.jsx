import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItem,
  ListItemText,
  Toolbar,
} from "@mui/material";

import { CategoriesContext, UserContext } from "../Context";

const drawerWidth = 240;

const Sidenav = () => {
  const navigate = useNavigate();
  const userInfo = useContext(UserContext);
  const categories = useContext(CategoriesContext);

  return (
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
          {userInfo &&
            categories !== undefined &&
            categories.map((el, index) => {
              return (
                <ListItem
                  disablePadding
                  key={`${el.route}-${index}`}
                  onClick={() =>
                    navigate(
                      `/project/63fe47296edfc3b387628861/issues/${el.toLowerCase()}`
                    )
                  }
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
  );
};

export default Sidenav;
