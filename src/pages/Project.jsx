import React, { useEffect, useState } from 'react'
import * as api from '~/api'
import {
  Typography,
  Grid,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material/'

export const ProjectPage = () => {
  const [project, setProject] = useState(null)
  useEffect(() => {
    if (project === null) {
      api
        .requests('get', '/api/project/63fe47296edfc3b387628861/projectinfo')
        .then((data) => setProject(data))
    }
  }, [])

  if (project) {
    return (
      <List sx={{ bgcolor: 'background.paper', maxWidth: 250, width: '100%' }}>
        {project.members.map((el) => {
          return (
            <div key={el.username}>
              <ListItem alignItems='flex-start'>
                <ListItemAvatar>
                  <Avatar
                    alt={el.username}
                    src={`https://cdn.discordapp.com/avatars/${el.discord_id}/${el.avatar}.png`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={el.username}
                  secondary={
                    <React.Fragment>
                      <Typography
                        color='text.primary'
                        component='span'
                        sx={{ display: 'inline' }}
                        variant='body2'
                      >
                        ROle HEre
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider component='li' variant='inset' />
            </div>
          )
        })}
      </List>
    )
  }
}
