import React, { useState, useEffect, useContext } from 'react'
import * as api from '~/api'
import { ProjectsContext } from '../../context'

import { useParams } from 'react-router-dom'
import { AutoComplete } from '../../components/AutoComplete'

import {
  Avatar,
  Button,
  ButtonGroup,
  Grid,
  Divider,
  Typography,
  Modal,
  Box,
} from '@mui/material'

const style = {
  bgcolor: 'background.paper',
  border: '2px solid #FFFFFF',
  boxShadow: 24,
  left: '50%',
  p: 4,
  position: 'absolute',
  textAlign: 'center',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
}

export const ProjectMembers = () => {
  const { project, setProject } = useContext(ProjectsContext)
  const [allUsers, setAllUsers] = useState()
  const [modalMessage, setModalMessage] = useState()
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [waitlistMembers, setWaitlistMembers] = useState([
    {
      discord_id: '',
      role: '',
    },
  ])

  const params = useParams()

  const addToWaitlist = () => {
    setWaitlistMembers([...waitlistMembers, { discord_id: '', role: '' }])
  }

  const removeFromWaitlist = (index) => {
    if (waitlistMembers.length > 1) {
      const updatedWaitlistMembers = [...waitlistMembers]
      updatedWaitlistMembers.splice(index, 1)
      setWaitlistMembers(updatedWaitlistMembers)
    } else {
      setWaitlistMembers([
        {
          discord_id: '',
          role: '',
        },
      ])
    }
  }

  const waitlistRoleUpdate = (index, role) => {
    const updatedWaitlistMembers = [...waitlistMembers]
    updatedWaitlistMembers[index] = {
      ...updatedWaitlistMembers[index],
      role: role,
    }
    setWaitlistMembers(updatedWaitlistMembers)
  }

  const updateMembersToAdd = (index, field, value) => {
    const updatedWaitlistMembers = [...waitlistMembers]
    updatedWaitlistMembers[index] = {
      ...updatedWaitlistMembers[index],
      [field]: value,
    }
    setWaitlistMembers(updatedWaitlistMembers)
  }

  const addWaitlistToProject = () => {
    const waitlistCopy = [...waitlistMembers]

    for (const el of waitlistCopy) {
      if (!el.discord_id || !el.discord_id.discord_id) {
        setModalMessage(
          "It seems one of the members you're trying to add doesn't exist!\nMaybe you have a blank field?",
        )
        handleOpen()
        break
      } else if (!el.role) {
        setModalMessage(
          `It seems one of the members you're trying to add doesn't have a role! Please add a role for \n ${el.discord_id.username}\n Then try again!`,
        )
        handleOpen()
        break
      } else {
        el.discord_id = el.discord_id.discord_id
      }
    }

    api
      .requests('put', `/api/project/${params.projectId}/addmembers`, {
        alert: true,
        alertMessage: 'Added all users to the project!',
        data: waitlistCopy,
      })
      .then(() => {
        api
          .requests('get', `/api/project/${params.projectId}`)
          .then((data) => setProject(data))
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

  return (
    <div>
      {project && (
        <Grid
          alignItems='center'
          container
          direction='row'
          justifyContent='center'
        >
          <Grid
            align={'center'}
            alignItems='center'
            container
            direction='row'
            item
            justifyContent='center'
            lg={12}
          >
            {waitlistMembers.map((assignment, index) => (
              <Grid item justifyContent='center' key={index} lg={12}>
                <Grid container direction='row'>
                  <Grid item lg={2.5}>
                    <AutoComplete
                      label={`Add member to ${project.name}`}
                      options={allUsers}
                      setter={(selectedValue) => {
                        updateMembersToAdd(index, 'discord_id', selectedValue)
                      }}
                    />
                  </Grid>
                  <Grid item lg={9.5}>
                    {waitlistMembers && (
                      <Grid container>
                        <Grid item lg={2}>
                          <Grid
                            alignItems='center'
                            container
                            direction='row'
                            justifyContent='space-evenly'
                            sx={{ pl: 2, pt: 1 }}
                          >
                            <Grid item lg={4}>
                              <Button
                                onClick={() => addToWaitlist()}
                                variant='outlined'
                              >
                                +
                              </Button>
                            </Grid>
                            <Grid item lg={4}>
                              <Button
                                color='error'
                                onClick={() => removeFromWaitlist(index)}
                                variant='outlined'
                              >
                                -
                              </Button>
                            </Grid>
                            <Grid item lg={4}>
                              <ButtonGroup
                                aria-label='outlined button group'
                                sx={{ pl: 2 }}
                                variant='outlined'
                              >
                                <Button
                                  disabled={
                                    waitlistMembers[index].role === 'maintainer'
                                  }
                                  onClick={() => {
                                    waitlistRoleUpdate(index, 'maintainer')
                                  }}
                                >
                                  Maintainer
                                </Button>
                                <Button
                                  disabled={
                                    waitlistMembers[index].role ===
                                    'contributor'
                                  }
                                  onClick={() => {
                                    waitlistRoleUpdate(index, 'contributor')
                                  }}
                                >
                                  Contributor
                                </Button>
                              </ButtonGroup>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Button
            onClick={() => addWaitlistToProject()}
            sx={{ mb: 2, mt: 2 }}
            variant='outlined'
          >{`Add all users to ${project.name}`}</Button>
          <Divider sx={{ mb: 2, mt: 2 }} />
        </Grid>
      )}
      <Divider sx={{ mb: 2, mt: 2 }} />

      {project &&
        project.members.map((el, index) => {
          return (
            <div key={el.discord_id}>
              <Grid alignItems='center' container justifyContent='space-evenly'>
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
              <Modal
                aria-describedby='modal-modal-description'
                aria-labelledby='modal-modal-title'
                onClose={handleClose}
                open={open}
              >
                <Box sx={style}>
                  <Typography
                    component='h2'
                    id='modal-modal-title'
                    variant='h2'
                  >
                    One Sec!
                  </Typography>
                  <Typography
                    id='modal-modal-description'
                    sx={{ mb: 2, mt: 2 }}
                  >
                    {modalMessage}
                  </Typography>
                  <Button
                    onClick={() => {
                      handleClose()
                    }}
                    variant='outlined'
                  >
                    Close
                  </Button>
                </Box>
              </Modal>
            </div>
          )
        })}
    </div>
  )
}
