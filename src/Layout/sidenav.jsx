import React, { useState, useEffect } from "react";
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
import axios from "axios";

const drawerWidth = 240;

const Sidenav = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!categories[0]) {
      axios
        .get(`/api/project/Pale-Court/categories`)
        .then((res) => setCategories(res.data));
    }
  }, [categories]);

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
          {categories.map((el, index) => {
            return (
              <ListItem
                disablePadding
                key={`${el.route}-${index}`}
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
  );
};

export default Sidenav;
