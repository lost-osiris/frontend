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
            ModForge is an exceptional website that revolutionizes the modding
            landscape by providing an easy and seamless platform for users to
            contribute to their favorite mod projects. With the seamless
            integration with Discord, ModForge creates a community-driven hub
            that promotes collaboration and enhances the overall modding
            experience.
          </Typography>
          <br />
          <Typography variant='body1'>your mom</Typography>
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
        {projects &&
          projects.map((project) => {
            return (
              <Grid item key={`project-card-${project.id}`}>
                <ProjectCard project={project} />
              </Grid>
            )
          })}
      </Grid>
    </div>
  )
}
