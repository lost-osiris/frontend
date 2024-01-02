import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TabPanel } from '../components/TabPanel'
import * as api from '~/api'
import { dispatchAlert } from '../store'
import { AutoComplete } from '../components/AutoComplete'

import { ProjectsContext, UserContext } from '../context'
import IssueWHExample from '../assets/Images/IssueWHExample.png'
import WaitlistWHExample from '../assets/Images/WaitlistWHExample.png'
import CommentWHExample from '../assets/Images/CommentWHExample.png'

import {
  Avatar,
  Autocomplete,
  Box,
  TextField,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tab,
  Tabs,
  Divider,
  Typography,
} from '@mui/material'

export const EditProject = () => {
  const { project, setProject } = useContext(ProjectsContext)
  const { user } = useContext(UserContext)
  const params = useParams()
  const navigate = useNavigate()
  const [blob, setBlob] = useState()
  const [tabValue, setTabValue] = useState(0)
  const [allUsers, setAllUsers] = useState()
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    if (!allUsers) {
      api.requests('get', '/api/user/findall/').then((data) => {
        if (project && data) {
          let filteredData = data.filter(
            (members1) =>
              !project.members.some(
                (members2) => members1.discord_id === members2.discord_id,
              ),
          )
          setAllUsers(filteredData)
        }
      })
    }
  }, [allUsers])

  useEffect(() => {
    if (project && user.discord_id !== project.owner) {
      navigate('/')
    }
  }, [params.projectId, project])

  const handleTabChange = (_, tab) => {
    setTabValue(tab)
  }

  const handleAddToProject = (role) => {
    // Logic to add the selected user to the project
    // This function will be triggered when the button is clicked
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

  const updateWebhooks = () => {
    api.requests('put', `/api/project/${params.projectId}/updatewebhooks`, {
      alert: true,
      alertMessage: 'Webhooks updated',
      data: project.webhooks,
    })
  }

  const updateBanner = () => {
    api
      .requests('put', `/api/project/${params.projectId}/updatebanner`, {
        alert: true,
        alertMessage: 'banner  updated',
        data: { file: blob, type: 'png' },
      })
      .then((data) => console.log(data))
  }

  return (
    <div>
      <Grid container>
        <Grid item lg={12} sx={{ mt: 5 }}>
          <Tabs onChange={handleTabChange} value={tabValue} variant='fullWidth'>
            <Tab id='manage-webhooks' label='Webhooks' />
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
              <Button onClick={() => updateWebhooks} variant='outlined'>
                Update Webhooks
              </Button>
            </Grid>
          </TabPanel>
          <TabPanel index={1} value={tabValue}>
            {project && (
              <Grid>
                <Grid align={'center'} item lg={12}>
                  <AutoComplete
                    label={`add users to ${project.name}`}
                    options={allUsers}
                    setter={setSelectedUser}
                  />

                  {selectedUser && (
                    <Grid
                      alignItems='baseline'
                      container
                      direction='row'
                      justifyContent='center'
                    >
                      <Grid item lg={3} sx={{ mt: 3 }}>
                        <Button
                          onClick={handleAddToProject('contributor')}
                          variant='outlined'
                        >
                          Add {selectedUser.username} as a contributor
                        </Button>
                      </Grid>
                      <Grid item lg={3} sx={{ mt: 3 }}>
                        <Button
                          onClick={handleAddToProject('maintainer')}
                          variant='outlined'
                        >
                          Add {selectedUser.username} as a maintainer
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                <Divider sx={{ mb: 2, mt: 2 }} />
              </Grid>
            )}
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
          <TabPanel index={2} value={tabValue}>
            <Button component='label' variant='contained'>
              asdfasdf
              <input
                accept='.png, .jpg, .jpeg'
                hidden
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file && file.size > 2 * 1024 * 1024) {
                    dispatchAlert({
                      message: 'Image must be less than 2MB',
                      type: 'error',
                    })
                  } else {
                    let image = new Blob([file], { type: file.type })
                    setBlob(image)
                  }
                }}
                type='file'
              />
            </Button>
            <Button onClick={updateBanner}> upload image</Button>
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  )
}
