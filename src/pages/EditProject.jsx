import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TabPanel } from '../components/TabPanel'
import * as api from '~/api'
import { dispatchAlert } from '../store'

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
  Grid,
  Tab,
  Tabs,
  Divider,
  Typography,
} from '@mui/material'

export const EditProject = () => {
  const { project, setProject } = useContext(ProjectsContext)
  const { user } = useContext(UserContext)
  const [members, setMembers] = useState()
  const [chosen, setchosen] = useState()
  const params = useParams()
  const navigate = useNavigate()
  const [blob, setBlob] = useState()
  const [btnColor, setBtnColor] = useState('primary')
  const [btnText, setBtnText] = useState('copy invite link')
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    if (project && user.discord_id !== project.owner) {
      navigate('/')
    }
  }, [params.projectId, project])

  useEffect(() => {
    if (!members) {
      api.requests('get', 'link here')
    }
  }, [members])

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
              <Button onClick={() => updateWebhooks} variant='outlined'>
                Update Webhooks
              </Button>
            </Grid>
          </TabPanel>
          <TabPanel index={1} value={tabValue}>
            {project && (
              <div>
                <Grid
                  alignItems='center'
                  container
                  direction='row'
                  justifyContent='center'
                >
                  <Grid item>
                    <Typography>
                      Invite others to your project, copy the link and share it
                      with others
                    </Typography>
                  </Grid>
                  <Grid item sx={{ pl: 2 }}>
                    <Autocomplete
                      autoHighlight
                      // getOptionLabel={(option) => option.label}
                      options={countries}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                          }}
                          label='Choose a country'
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box
                          component='li'
                          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                          {...props}
                        >
                          <img
                            alt=''
                            loading='lazy'
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                            width='20'
                          />
                          {option.label} ({option.code}) +{option.phone}
                        </Box>
                      )}
                      sx={{ width: 300 }}
                    />
                  </Grid>
                </Grid>
                <Divider sx={{ m: 1, mt: 4 }} />
              </div>
            )}
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
          <TabPanel index={3} value={tabValue}>
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
