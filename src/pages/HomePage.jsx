import React, { useContext } from 'react'
import { ProjectCard } from '../components/ProjectCard'
import Loading from '../components/Loading'
import { ProjectsContext } from '../context'

import { Typography, Grid, Divider } from '@mui/material/'

export const Homepage = () => {
  const { projects } = useContext(ProjectsContext)

  return (
    <div>
      <Grid container sx={{ pb: 10, pl: 5, pr: 5, pt: 3 }}>
        <Grid item lg={12}>
          <Typography textAlign={'center'} variant='h4'>
            Welcome to ModForge
          </Typography>
          <Divider sx={{ mb: 4, mt: 2 }} />
          <Typography variant='body1'>
            ModForge is currently in beta. Thank you for helping test and make
            this application grow.
          </Typography>
          <br />
        </Grid>
      </Grid>
      <Grid
        alignItems='stretch'
        container
        direction='row'
        justifyContent='flex-start'
        spacing={5}
        sx={{ pl: 5, pr: 5 }}
      >
        {!projects && <Loading />}
        {projects && (
          <>
            {projects.user_projects.map((project) => (
              <Grid item key={`user-project-card-${project.id}`}>
                <ProjectCard project={project} />
              </Grid>
            ))}
            {projects.public_projects.map((project) => (
              <Grid item key={`public-project-card-${project.id}`}>
                <ProjectCard project={project} />
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </div>
  )
}
