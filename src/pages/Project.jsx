import React, { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserContext, ProjectsContext } from '../context'
import Loading from '../components/Loading'
import HKVocalized from '../assets/CardImages/HKVocalized.png'
import PaleCourt from '../assets/CardImages/PaleCourt.jpg'
import SealedEchoes from '../assets/CardImages/SealedEchoes.jpg'

import { Avatar, AvatarGroup, Button, Grid } from '@mui/material/'

export const ProjectPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { project } = useContext(ProjectsContext)
  const { user } = useContext(UserContext)
  let imageUrl

  if (!project) {
    return <Loading />
  }

  if (project.name === 'Hallownest Vocalized') {
    imageUrl = HKVocalized
  } else if (project.name === 'Pale Court') {
    imageUrl = PaleCourt
  } else if (project.name === 'Sealed Echoes') {
    imageUrl = SealedEchoes
  }

  return (
    <div>
      {user.discord_id === project.owner && (
        <Button onClick={() => navigate(`/project/${params.projectId}/edit`)}>
          Edit Project
        </Button>
      )}
      <Grid container>
        <Grid item lg={12}>
          <img
            alt={project.name}
            src={imageUrl}
            style={{
              maxHeight: '400px',
              maxWidth: '1600px',
              minHeight: '400px',
              minWidth: '1600px',
            }}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item lg={6}>
          {project.description}
        </Grid>
        <Grid item lg={6}>
          <AvatarGroup max={project.members.length}>
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
        </Grid>
      </Grid>
    </div>
  )
}
