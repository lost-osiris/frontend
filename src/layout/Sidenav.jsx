import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItem,
  ListItemText,
  Toolbar,
} from '@mui/material'

import { ProjectsContext, UserContext } from '~/context'

const drawerWidth = 240

const Sidenav = ({ showComponent }) => {
  const navigate = useNavigate()
  const userInfo = useContext(UserContext)
  const { project } = useContext(ProjectsContext)

  return (
    <Drawer
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
        },
        display: showComponent ? showComponent : 'display',
        flexShrink: 0,
        width: drawerWidth,
      }}
      variant='permanent'
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {userInfo &&
            project &&
            project.categories !== undefined &&
            project.categories.map((el, index) => {
              return (
                <ListItem
                  disablePadding
                  key={`${el.route}-${index}`}
                  onClick={() =>
                    navigate(
                      `/project/${project.id}/issues/${el.toLowerCase()}`,
                    )
                  }
                >
                  <ListItemButton>
                    <ListItemText primary={el} />
                  </ListItemButton>
                </ListItem>
              )
            })}
        </List>
      </Box>
    </Drawer>
  )
}

export default Sidenav
