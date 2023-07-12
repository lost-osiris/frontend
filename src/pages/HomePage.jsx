import React, { useEffect, useState } from 'react'
import * as api from '~/api'
import { ProjectCard } from '../components/ProjectCard'

import { Typography, Grid, Divider } from '@mui/material/'

export const Homepage = () => {
  const [project, setProject] = useState(null)

  useEffect(() => {
    if (project === null) {
      api
        .requests('get', '/api/project/63fe47296edfc3b387628861/projectinfo')
        .then((data) => setProject(data))
    }
  }, [])

  return (
    <div>
      <Grid>
        <Grid container sx={{ pb: 8 }}>
          <Grid item lg={2}></Grid>
          <Grid item lg={8}>
            <Typography textAlign={'center'} variant='h4'>
              Welcome to ModForge
            </Typography>
            <Divider />
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
          <Grid item lg={2}></Grid>
        </Grid>

        <Grid alignItems={'center'} container>
          <Grid item>
            {project && (
              <ProjectCard
                description={project.description}
                memberCount={project.member_count}
                members={project.members}
                name={project.name}
                owner={project.owner}
                projectId={project.project_id}
                version={project.version}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
