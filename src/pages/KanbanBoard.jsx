import React, { useState, useEffect, useContext } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { UserContext, ProjectsContext, KanbanBoardContext } from '~/context'

import { toTitleCase } from '~/utils'
import { IssueCard } from '~/components/KanbanBoard/IssueCard'

import { Typography, Grid, Switch, Chip, Divider, Box } from '@mui/material'
import ProjectMemberAlert from '~/components/ProjectMemberAlert'
import { IssueListColumn } from '~/components/KanbanBoard/IssueColumn'
import Loading from '~/components/Loading'

export const KanbanBoardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isMember, setIsMember] = useState(false)
  const archived = Boolean(searchParams.get('archived') === 'true')
  const userInfo = useContext(UserContext)
  const { issues, issuesLoading } = useContext(KanbanBoardContext)
  const { project } = useContext(ProjectsContext)
  const params = useParams()

  const getNumOfArchived = () => {
    if (issues) {
      let numOfArchived = issues.filter((el) => el.archived === true).length

      if (numOfArchived) {
        return numOfArchived
      } else {
        return 0
      }
    }
  }

  useEffect(() => {
    if (project) {
      setIsMember(
        userInfo.user.projects.some(
          (projectInfo) => projectInfo.id === project.id,
        ),
      )
    }
  }, [project, userInfo])

  if (!project || (!isMember && !project.is_public)) {
    return <ProjectMemberAlert />
  }

  if (issuesLoading || !project) {
    return <Loading />
  }

  if (issues.length === 0 && !issuesLoading) {
    return (
      <Grid container justifyContent='center'>
        <Grid item>
          <Typography variant='h2'>No issues found!</Typography>
        </Grid>
      </Grid>
    )
  }

  return (
    <Box>
      <Typography textAlign='center' variant='h3'>
        {toTitleCase(params.category)}
      </Typography>
      <Grid container>
        <Typography sx={{ mr: 1 }}>
          <Switch
            checked={archived}
            name='Archived'
            onChange={() => {
              if (archived) {
                searchParams.set('archived', 'false')
                setSearchParams(searchParams)
              } else {
                searchParams.set('archived', 'true')
                setSearchParams(searchParams)
              }
            }}
          />
          Archived
        </Typography>
        <Chip
          color='primary'
          label={getNumOfArchived()}
          size='small'
          sx={{ mt: 0.7 }}
        />
      </Grid>
      <Divider sx={{ mb: 1, mt: 1 }} />

      {!archived && (
        <Grid container spacing={3}>
          <Grid item lg={3}>
            <IssueListColumn name='reported' />
          </Grid>

          <Grid item lg={3}>
            <IssueListColumn name='in-progress' />
          </Grid>

          <Grid item lg={3}>
            <IssueListColumn name='completed' />
          </Grid>

          <Grid item lg={3}>
            <IssueListColumn name="won't-fix" />
          </Grid>
        </Grid>
      )}

      {archived && (
        <div>
          <Grid container spacing={2}>
            {issues
              .filter((el) => archived === el.archived)
              .map((el, index) => {
                return (
                  <Grid item key={`${index}-${JSON.stringify(el._id)}`} lg={3}>
                    <IssueCard issue={el} />
                  </Grid>
                )
              })}
          </Grid>
        </div>
      )}
    </Box>
  )
}
