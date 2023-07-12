import React from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Typography,
  Avatar,
  AvatarGroup,
  CardMedia,
  CardContent,
  Card,
  Grid,
} from '@mui/material/'

export const ProjectCard = (props) => {
  const { name, description, version, members, memberCount, projectId } = props
  const navigate = useNavigate()
  let maxAvatars = Math.min(Math.round(memberCount / 4) || 9, 9)

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        alt={name}
        component='img'
        image='https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/07/hollow-knight-pale-court.jpg'
      />
      <CardContent>
        <Typography
          component='div'
          onClick={() => navigate(`/project/${projectId}`)}
          sx={{
            '&:hover': {
              cursor: 'pointer',
              opacity: [0.9, 0.8, 0.7],
              textDecoration: 'underline',
            },
          }}
          textAlign={'center'}
          variant='h4'
        >
          {name}
        </Typography>
        <Grid container>
          <Grid item lg={3.7}></Grid>
          <Grid alignItems={'center'} item lg={8}>
            <Typography
              align={'center'}
              color='text.secondary'
              variant='overline'
            >
              version {version}
            </Typography>
          </Grid>
          <Grid item lg={2}></Grid>
        </Grid>
      </CardContent>
      <CardContent>
        {' '}
        <Typography color='text.secondary' variant='body2'>
          {description}
        </Typography>
      </CardContent>
      <CardContent>
        <AvatarGroup max={maxAvatars}>
          {members.map((el, index) => {
            return (
              <Avatar
                alt={el.username}
                key={`${index}-${JSON.stringify(el.username)}`}
                src={`https://cdn.discordapp.com/avatars/${el.discord_id}/${el.avatar}.png`}
              />
            )
          })}
        </AvatarGroup>
      </CardContent>
    </Card>
  )
}
