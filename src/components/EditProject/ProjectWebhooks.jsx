import React, { useContext } from 'react'

import IssueWHExample from '../../assets/Images/IssueWHExample.png'
import CommentWHExample from '../../assets/Images/CommentWHExample.png'
import * as api from '~/api'
import { ProjectsContext } from '../../context'

import { useParams } from 'react-router-dom'

import { TextField, Button, Grid } from '@mui/material'

export const ProjectWebhooks = () => {
  const { project, setProject } = useContext(ProjectsContext)
  const params = useParams()

  const updateWebhooks = () => {
    api.requests('put', `/api/project/${params.projectId}/webhooks`, {
      alert: true,
      alertMessage: 'Webhooks updated',
      data: project.webhooks,
    })
  }

  return (
    <div>
      <Grid
        alignItems='center'
        container
        direction='row'
        justifyContent={'center'}
        sx={{ mb: 2, mt: 2 }}
      >
        <Grid item lg={2}>
          <TextField
            id='issue-webhook'
            label='Issue Webhook'
            maxRows={4}
            onChange={(e) =>
              setProject({
                ...project,
                webhooks: {
                  ...project.webhooks,
                  issue: e.target.value,
                },
              })
            }
            placeholder={project?.webhooks.issue || 'Issue Webhook'}
            value={project?.webhooks.issue || ''}
            variant='outlined'
          />
        </Grid>
        <Grid item lg={5}>
          <div>
            This will display a webhook message that details when an issue has
            been created, edited, or deleted
          </div>
        </Grid>
        <Grid item lg={5}>
          <img src={IssueWHExample} />
        </Grid>
      </Grid>

      <Grid
        alignItems='center'
        container
        direction='row'
        justifyContent={'center'}
        sx={{ mb: 2, mt: 2 }}
      >
        <Grid item lg={2}>
          <TextField
            id='comment-webhook'
            label='Comment Webhook'
            maxRows={4}
            onChange={(e) =>
              setProject({
                ...project,
                webhooks: {
                  ...project.webhooks,
                  comment: e.target.value,
                },
              })
            }
            placeholder={project?.webhooks.comment || 'Comment Webhook'}
            value={project?.webhooks.comment || ''}
            variant='outlined'
          />
        </Grid>
        <Grid item lg={5}>
          <div>
            This will display a webhook message that details a comment that has
            been made under an issue
          </div>
        </Grid>
        <Grid item lg={5}>
          <img src={CommentWHExample} />
        </Grid>
      </Grid>
      <Grid
        alignItems='center'
        container
        direction='row'
        justifyContent='center'
        sx={{ mt: 2 }}
      >
        <Button onClick={updateWebhooks} variant='outlined'>
          Update Webhooks
        </Button>
      </Grid>
    </div>
  )
}
