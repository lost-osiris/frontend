import React, { createContext, useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { UserContext } from './Authentication'
import * as api from '~/api'

export const ProjectsContext = createContext({})

export const ProjectsProvider = (props) => {
  const userInfo = useContext(UserContext)
  const [projects, setProjects] = useState()
  const [project, setProject] = useState()
  let params = useParams()

  useEffect(() => {
    if (!projects && userInfo) {
      api.requests('get', '/api/projects').then((data) => setProjects(data))
    }
  }, [projects, userInfo])

  useEffect(() => {
    if (
      (params.projectId && !projects) ||
      (params.projectId && !project) ||
      (project && params.projectId !== project.id)
    ) {
      api
        .requests('get', `/api/project/${params.projectId}`)
        .then((data) => setProject(data))
    }
  }, [params, projects, project])

  return (
    <ProjectsContext.Provider
      value={{
        project: project,
        projects: projects,
      }}
    >
      {props.children}
    </ProjectsContext.Provider>
  )
}
