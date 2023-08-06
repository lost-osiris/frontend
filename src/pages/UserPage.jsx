import React, { useContext } from 'react'
import { ProjectCard } from '../components/ProjectCard'
import Loading from '../components/Loading'
import { ProjectsContext } from '../context'

import { Typography, Grid, Divider } from '@mui/material/'

export const UserPage = () => {
  const { projects } = useContext(ProjectsContext)

  return (
    <div>
      <Grid container sx={{ pb: 5, pl: 5, pr: 5, pt: 3 }}>
        <Grid item lg={12}>
          <Typography textAlign={'center'} variant='h4'>
            Your Projects
          </Typography>
          <Divider sx={{ mt: 2 }} />
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
        {projects ? (
          projects.user_projects.length > 0 ? (
            projects.user_projects.map((project) => (
              <Grid item key={`project-card-${project.id}`}>
                <ProjectCard project={project} />
              </Grid>
            ))
          ) : (
            <Typography sx={{ ml: 5 }} variant='body1'>
              No projects found.
            </Typography>
          )
        ) : (
          <Loading />
        )}
      </Grid>
    </div>
  )
}
