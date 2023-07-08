import React, { useState, useEffect } from 'react'
import { ProjectCard } from '~/components/ProjectCard'
import * as api from '~/api'
import Loading from '~/components/Loading'

import { Grid } from '@mui/material'

export const ProjectList = () => {
  let [projects, setProjects] = useState(null)

  useEffect(() => {
    if (projects === null) {
      api.requests('get', '/api/projects').then((data) => setProjects(data))
    }
  })

  if (!projects) {
    return <Loading />
  }

  return (
    <div>
      <Grid container spacing={3}>
        {projects.map((el, index) => {
          return (
            <Grid item key={`${index}-${JSON.stringify(el)}`} md={4}>
              <ProjectCard project={el} />
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}
