import React from 'react'
import { useNavigate } from 'react-router-dom'
import HKVocalized from '../assets/CardImages/HKVocalized.png'
import PaleCourt from '../assets/CardImages/PaleCourt.jpg'
import SealedEchoes from '../assets/CardImages/SealedEchoes.jpg'
import HKM_Blank from '../assets/CardImages/HKM_Blank.png'

import {
  Typography,
  Avatar,
  AvatarGroup,
  Box,
  CardMedia,
  CardContent,
  Card,
} from '@mui/material/'

export const ProjectCard = ({ project }) => {
  let imageUrl

  if (project.name === 'Hallownest Vocalized') {
    imageUrl = HKVocalized
  } else if (project.name === 'Pale Court') {
    imageUrl = PaleCourt
  } else if (project.name === 'Sealed Echoes') {
    imageUrl = SealedEchoes
  } else if (project.name === 'Menderbug Installer') {
    imageUrl = HKM_Blank
  }

  const navigate = useNavigate()
  let maxAvatars = Math.min(Math.round(project.memberCount / 4) || 9, 9)

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        maxWidth: 350,
      }}
    >
      <CardMedia
        component='img'
        image={imageUrl}
        sx={{ maxHeight: '197px', maxWidth: '350px', objectFit: 'contain' }}
      />
      <CardContent
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
      >
        <Typography
          component='div'
          onClick={() => navigate(`/project/${project.id}`)}
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
          {project.name}
        </Typography>

        <Typography align={'center'} color='text.secondary' variant='overline'>
          version {project.version}
        </Typography>

        <Typography color='text.secondary' variant='body2'>
          {project.description}
        </Typography>

        <Box marginTop={'auto'} sx={{ pt: 1 }}>
          <AvatarGroup max={maxAvatars}>
            {project.members.map((el, index) => {
              return (
                <Avatar
                  alt={el.username}
                  key={`${index}-${JSON.stringify(el.username)}`}
                  src={`https://cdn.discordapp.com/avatars/${el.discord_id}/${el.avatar}.png`}
                />
              )
            })}
          </AvatarGroup>
        </Box>
      </CardContent>
    </Card>
  )
}
