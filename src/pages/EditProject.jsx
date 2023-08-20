import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TabPanel } from '../components/TabPanel'
import * as api from '~/api'

import { ProjectsContext, UserContext } from '../context'
import IssueWHExample from '../assets/Images/IssueWHExample.png'
import WaitlistWHExample from '../assets/Images/WaitlistWHExample.png'
import CommentWHExample from '../assets/Images/CommentWHExample.png'

import {
  Avatar,
  TextField,
  Button,
  ButtonGroup,
  Grid,
  Tab,
  Tabs,
  Divider,
  Typography,
} from '@mui/material'

export const EditProject = () => {
  const { projects } = useContext(ProjectsContext)
  const { user } = useContext(UserContext)
  const params = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState()
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    if (projects && params.projectId) {
      const foundProject = projects.user_projects.find(
        (el) => el.id === params.projectId,
      )

      if (!foundProject) {
        navigate('/')
      }

      if (foundProject) {
        if (user.discord_id !== foundProject.owner) {
          navigate('/')
        }

        api
          .requests('get', `/api/project/${params.projectId}/getwebhooks`)
          .then((data) => {
            setProject({ ...foundProject, webhooks: data.webhooks })
          })
      }
    }
  }, [projects, params.projectId])

  const handleTabChange = (_, tab) => {
    setTabValue(tab)
  }

  const addToProject = (index, el, role) => {
    let updatedMembers = [...project.waitlist]
    api
      .requests(
        'put',
        `/api/project/${params.projectId}/members/updatewaitlist`,
        {
          alert: true,
          alertMessage:
            role !== 'remove'
              ? 'Successfully approved waitlist'
              : 'Successfully rejected user from project',
          data: [el, role],
        },
      )
      .then(() => {
        updatedMembers.splice(1, index)

        setProject({
          ...project,
          members: updatedMembers,
        })
      })
  }

  const updateMember = (index, role) => {
    let updatedMembers = [...project.members]

    api
      .requests('put', `/api/project/${params.projectId}/updatemember`, {
        alert: true,
        alertMessage:
          role !== 'remove'
            ? `${updatedMembers[index].username}'s role was set to ${role}`
            : `${updatedMembers[index].username} was removed from ${project.name}`,
        data: [updatedMembers[index], role],
      })
      .then(() => {
        if (role === 'remove') {
          updatedMembers.splice(1, index)
        } else {
          updatedMembers[index].role = role
        }

        setProject({
          ...project,
          members: updatedMembers,
        })
      })
  }

  return (
    <div>
      <Grid container>
        <Grid item lg={12} sx={{ mt: 5 }}>
          <Tabs onChange={handleTabChange} value={tabValue} variant='fullWidth'>
            <Tab id='manage-webhooks' label='Webhooks' />
            <Tab id='manage-waitlist' label='Waitlist' />
            <Tab id='manage-members' label='Members' />
            <Tab id='manage-info' label='Info' />
          </Tabs>
          <Divider sx={{ mb: 2, mt: 2 }} />
          <TabPanel index={0} value={tabValue}>
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
                  This will display a webhook message that details when an issue
                  has been created, edited, or deleted
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
                  id='waitlist-webhook'
                  label='Waitlist Webhook'
                  maxRows={4}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      webhooks: {
                        ...project.webhooks,
                        waitlist: e.target.value,
                      },
                    })
                  }
                  placeholder={project?.webhooks.waitlist || 'Waitlist Webhook'}
                  value={project?.webhooks.waitlist || ''}
                  variant='outlined'
                />
              </Grid>
              <Grid item lg={5}>
                <div>
                  This will display a webhook message that shows when a user has
                  requested access to the project, as well as shows the result
                  of acceptance or denial
                </div>
              </Grid>
              <Grid item lg={5}>
                <img src={WaitlistWHExample} />
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
                  This will display a webhook message that details a comment
                  that has been made under an issue
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
              <Button
                onClick={() => {
                  api.requests(
                    'put',
                    `/api/project/${params.projectId}/updatewebhooks`,
                    {
                      alert: true,
                      alertMessage: 'Webhooks updated',
                      data: project.webhooks,
                    },
                  )
                }}
                variant='outlined'
              >
                Update Webhooks
              </Button>
            </Grid>
          </TabPanel>
          <TabPanel index={1} value={tabValue}>
            {project &&
              project.waitlist.map((el, index) => {
                return (
                  <div key={el.discord_id}>
                    <Grid
                      alignItems='center'
                      container
                      justifyContent='space-evenly'
                    >
                      <Grid item>
                        <Avatar
                          src={`https://cdn.discordapp.com/avatars/${el.discord_id}/${el.avatar}.png`}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant='h5'>{el.username}</Typography>
                      </Grid>
                      <Grid item>
                        <ButtonGroup
                          aria-label='outlined button group'
                          sx={{ pl: 2 }}
                          variant='outlined'
                        >
                          <Button
                            onClick={() => {
                              addToProject(index, el, 'maintainer')
                            }}
                          >
                            Maintainer
                          </Button>
                          <Button
                            onClick={() => {
                              addToProject(index, el, 'contributor')
                            }}
                          >
                            Contributor
                          </Button>
                        </ButtonGroup>
                        <Button
                          color='error'
                          onClick={() => {
                            addToProject(index, el, 'remove')
                          }}
                          sx={{ ml: 4 }}
                          variant='outlined'
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                    <Divider sx={{ mb: 2, mt: 2 }} />
                  </div>
                )
              })}
          </TabPanel>
          <TabPanel index={2} value={tabValue}>
            {project &&
              project.members.map((el, index) => {
                return (
                  <div key={el.discord_id}>
                    <Grid
                      alignItems='center'
                      container
                      justifyContent='space-evenly'
                    >
                      <Grid item lg={0.5}>
                        <Avatar
                          src={`https://cdn.discordapp.com/avatars/${el.discord_id}/${el.avatar}.png`}
                        />
                      </Grid>
                      <Grid item lg={1.5}>
                        <Typography variant='h5'>{el.username}</Typography>
                      </Grid>
                      <div>
                        Role
                        <Typography sx={{ pl: 2 }} variant='overline'>
                          {el.role}
                        </Typography>
                      </div>
                      <Grid item lg={5} sx={{ pl: 4 }}>
                        <ButtonGroup
                          aria-label='outlined button group'
                          sx={{ pl: 2 }}
                          variant='outlined'
                        >
                          <Button
                            disabled={el.role === 'maintainer'}
                            onClick={() => {
                              updateMember(index, 'maintainer')
                            }}
                          >
                            Maintainer
                          </Button>
                          <Button
                            disabled={el.role === 'contributor'}
                            onClick={() => {
                              updateMember(index, 'contributor')
                            }}
                          >
                            Contributor
                          </Button>
                        </ButtonGroup>
                        <Button
                          color='error'
                          onClick={() => {
                            updateMember(index, 'remove')
                          }}
                          sx={{ ml: 4 }}
                          variant='outlined'
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                    <Divider sx={{ mb: 2, mt: 2 }} />
                  </div>
                )
              })}
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  )
}
