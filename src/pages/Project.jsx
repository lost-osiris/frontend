import React, { useContext } from 'react'
import {
  Typography,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material/'
import { ProjectsContext } from '../context'
import Loading from '../components/Loading'

export const ProjectPage = () => {
  const { project } = useContext(ProjectsContext)

  if (!project) {
    return <Loading />
  }

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
                      ROlE HERE
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
