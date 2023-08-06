import React, { useState, useEffect, useContext } from 'react'
import * as api from '~/api'
import { toTitleCase } from '~/utils'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ProjectsContext, UserContext } from '~/context'

import {
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  MenuItem,
  Button,
  Grid,
  FormGroup,
  Checkbox,
} from '@mui/material/'
import RadioGroup from '@mui/material/RadioGroup'
import SendIcon from '@mui/icons-material/Send'
import Loading from '~/components/Loading'
import TinyMce from '~/components/TinyMce'

export const CreateIssue = () => {
  const userInfo = useContext(UserContext)
  const { project } = useContext(ProjectsContext)

  let params = useParams()
  let location = useLocation()
  let navigate = useNavigate()

  const [version, setVersion] = useState(location.state?.version || '')
  const [modlogsButtonColor, setModlogsButtonColor] = useState('primary')
  const [modlogsButtonText, setModlogsButtonText] = useState('Upload Modlogs')

  let defaultState = {
    archived: location.state?.archived || false,
    attachments: {
      embedSource: location.state?.attachments.embedSource || '',
      generalUrl: location.state?.attachments.generalUrl || '',
    },
    category:
      toTitleCase(location.state?.category) ||
      toTitleCase(decodeURI(params.category)) ||
      'General',
    date: new Date(),
    description: location.state?.description || '',
    discord_id:
      location.state?.discord_id ||
      (!userInfo.user.discord_id || null ? '' : userInfo.user.discord_id),
    modlogs: {
      body: location.state?.modlogs.body || '',
      title: location.state?.modlogs.title || '',
    },
    os: location.state?.os || [],
    priority: location.state?.priority || 'medium',
    project_id: params.projectId,
    status: location.state?.status || 'reported',
    summary: location.state?.summary || '',
    type: location.state?.type || 'bug',
    version:
      location.state?.version ||
      (!version === undefined || null ? null : version),
  }

  const [newIssue, setNewIssue] = useState(defaultState)

  const updateNewIssue = (field, value) => {
    if (field === 'modlogs') {
      const reader = new FileReader()
      reader.readAsText(value)
      reader.onload = () => {
        setNewIssue({
          ...newIssue,
          modlogs: {
            body: reader.result,
            title: value.name,
          },
        })
        setModlogsButtonColor('success')
        setModlogsButtonText('Success!')
      }
      reader.onerror = () => {
        console.log('file error', reader.error) //eslint-disable-line
      }
    } else if (field === 'attachmentsUrl') {
      setNewIssue({
        ...newIssue,
        attachments: { ...newIssue.attachments, generalUrl: value },
      })
    } else if (field === 'attachmentsEmbedSource') {
      setNewIssue({
        ...newIssue,
        attachments: { ...newIssue.attachments, embedSource: value },
      })
    } else if (field === 'version') {
      setNewIssue({
        ...newIssue,
        version: version,
      })
    } else if (field === 'os') {
      let issue = { ...newIssue }
      let index = issue.os.indexOf(value)

      if (index === -1) {
        issue.os.push(value)
      } else {
        issue.os.splice(index, 1)
      }
      setNewIssue(issue)
    } else {
      let issue = { ...newIssue }
      issue[field] = value

      setNewIssue(issue)
    }
  }

  useEffect(() => {
    if (!version) {
      api
        .requests('get', `/api/project/${params.projectId}`)
        .then((data) => setVersion(data.version))
    }
  }, [version, location])

  const handleFormSubmit = async () => {
    if (newIssue.summary !== '') {
      let issue = {
        ...newIssue,
        version: version,
      }
      let promise

      if (location.state?.id) {
        promise = api.requests(
          'put',
          `/api/project/${params.projectId}/issue/${location.state.id}`,
          {
            alert: true,
            alertMessage: `Successfully update "${
              issue.summary
            }" with status "${toTitleCase(issue.status)}"`,
            data: {
              issue: { ...issue, id: location.state.id },
              userInfo: userInfo.user,
            },
          },
        )
      } else {
        promise = api.requests('post', '/api/issue', {
          alert: true,
          alertMessage: `Successfully added "${
            issue.summary
          }" with status "${toTitleCase(issue.status)}"`,
          data: issue,
        })
      }
      promise.then(() => {
        setNewIssue({
          archived: false,
          attachments: {
            embedSource: '',
            generalUrl: '',
          },
          category: 'General',
          date: new Date(),
          description: '',
          discord_id:
            !userInfo.user.discord_id || null ? '' : userInfo.user.discord_id,
          modlogs: {
            body: '',
            title: '',
          },
          os: [],
          priority: 'medium',
          project_id: params.projectId,
          status: 'reported',
          summary: '',
          type: 'bug',
          version: '',
        })

        if (location.state?.id) {
          navigate(`/project/${params.projectId}/issue/${location.state.id}`)
        }
      })
    } else {
      window.alert('Please fill out all of the required fields!')
    }
  }

  if (project === undefined) {
    return <Loading />
  }

  return (
    <div>
      <FormControl>
        <Grid
          container
          justifyContent='space-between'
          spacing={3}
          sx={{ pl: 3, pr: 3 }}
        >
          <Grid item lg={12}>
            <TextField
              fullWidth
              id='summary'
              label='Summary'
              multiline
              onChange={(e) => updateNewIssue('summary', e.target.value)}
              placeholder='Summary'
              required
              value={newIssue.summary}
            />
          </Grid>

          <Grid item lg={4}>
            <Grid container>
              <Grid item lg={12}>
                <TextField
                  fullWidth
                  id='category-select'
                  label='Category'
                  onChange={(e) => updateNewIssue('category', e.target.value)}
                  required
                  select
                  sx={{ pb: 2 }}
                  value={newIssue.category}
                >
                  {project &&
                    project.categories.map((category) => (
                      <MenuItem
                        key={toTitleCase(category)}
                        value={toTitleCase(category)}
                      >
                        {toTitleCase(category)}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item lg={12}>
                <TextField
                  disabled
                  fullWidth
                  id='player-name'
                  label='Player'
                  onChange={(e) => updateNewIssue('playerName', e.target.value)}
                  required
                  sx={{ pb: 2 }}
                  value={userInfo.user.username}
                  variant='standard'
                />
              </Grid>
              <Grid item lg={12}>
                <TextField
                  disabled
                  fullWidth
                  id='version'
                  label='Version'
                  onChange={(e) => updateNewIssue('version', e.target.value)}
                  value={version}
                  variant='standard'
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item lg={2}>
            <FormLabel id='type-label-group'>Type</FormLabel>
            <RadioGroup id='type-radio' sx={{ pb: 3 }}>
              <FormControlLabel
                checked={newIssue.type === 'bug'}
                control={
                  <Radio
                    onChange={(e) => updateNewIssue('type', e.target.value)}
                  />
                }
                label='Bug'
                value='bug'
              />
              <FormControlLabel
                checked={newIssue.type === 'suggestion'}
                control={
                  <Radio
                    onChange={(e) => updateNewIssue('type', e.target.value)}
                  />
                }
                label='Suggestion'
                value='suggestion'
              />
            </RadioGroup>
          </Grid>

          <Grid item lg={2}>
            <FormLabel id='priority-label-group' sx={{ pt: 3 }}>
              Priority
            </FormLabel>
            <RadioGroup id='priority-radio' sx={{ pb: 3 }}>
              <FormControlLabel
                checked={newIssue.priority === 'low'}
                control={
                  <Radio
                    onChange={(e) => updateNewIssue('priority', e.target.value)}
                  />
                }
                label='Low Priority'
                value='low'
              />
              <FormControlLabel
                checked={newIssue.priority === 'medium'}
                control={
                  <Radio
                    onChange={(e) => updateNewIssue('priority', e.target.value)}
                  />
                }
                label='Medium Priority'
                value='medium'
              />
              <FormControlLabel
                checked={newIssue.priority === 'high'}
                control={
                  <Radio
                    onChange={(e) => updateNewIssue('priority', e.target.value)}
                  />
                }
                label='High Priority'
                value='high'
              />
            </RadioGroup>
          </Grid>

          <Grid item lg={2}>
            <FormLabel id='status-label-group' sx={{ pt: 3 }}>
              Status
            </FormLabel>
            <RadioGroup id='status-radio' sx={{ pb: 3 }}>
              <FormControlLabel
                checked={newIssue.status === 'reported'}
                control={
                  <Radio
                    onChange={(e) => updateNewIssue('status', e.target.value)}
                  />
                }
                label='Reported'
                value='reported'
              />
              <FormControlLabel
                checked={newIssue.status === 'in-progress'}
                control={
                  <Radio
                    onChange={(e) => updateNewIssue('status', e.target.value)}
                  />
                }
                label='In Progress'
                value='in-progress'
              />
              <FormControlLabel
                checked={newIssue.status === 'completed'}
                control={
                  <Radio
                    onChange={(e) => {
                      updateNewIssue('status', e.target.value)
                    }}
                  />
                }
                label='Completed'
                value='completed'
              />
              <FormControlLabel
                checked={newIssue.status === "won't-fix"}
                control={
                  <Radio
                    onChange={(e) => updateNewIssue('status', e.target.value)}
                  />
                }
                label="Won't Fix"
                value="won't-fix"
              />
            </RadioGroup>
          </Grid>
          <Grid item lg={2}>
            <FormLabel id='os-label-group' sx={{ pt: 3 }}>
              Operating System
            </FormLabel>
            <FormGroup id='os-radio' sx={{ pb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newIssue.os.indexOf('windows') > -1}
                    onChange={(e) => updateNewIssue('os', e.target.value)}
                  />
                }
                label='Windows'
                name='windows'
                value='windows'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newIssue.os.indexOf('macOS') > -1}
                    onChange={(e) => updateNewIssue('os', e.target.value)}
                  />
                }
                label='macOS'
                name='macOS'
                value='macOS'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newIssue.os.indexOf('linux') > -1}
                    onChange={(e) => {
                      updateNewIssue('os', e.target.value)
                    }}
                  />
                }
                label='Linux'
                name='linux'
                value='linux'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newIssue.os.indexOf('handheld') > -1}
                    onChange={(e) => {
                      updateNewIssue('os', e.target.value)
                    }}
                  />
                }
                label='Handheld'
                name='handheld'
                value='handheld'
              />
            </FormGroup>
          </Grid>

          <Grid item lg={12}>
            <TinyMce
              height={500}
              onChange={(e) => updateNewIssue('description', e)}
              value={newIssue.description}
            />
          </Grid>
          <Grid item lg={12}>
            <Grid container justifyContent='space-between' spacing={3}>
              <Grid item lg={6}>
                <Button
                  color={modlogsButtonColor}
                  component='label'
                  variant='contained'
                >
                  {modlogsButtonText}
                  <input
                    accept='text/*'
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file && file.size > 4 * 1024 * 1024) {
                        setModlogsButtonColor('error')
                        setModlogsButtonText('File size too large! ( > 4MB )')
                        setTimeout(() => {
                          setModlogsButtonColor('primary')
                          setModlogsButtonText('Upload Modlogs')
                        }, 5000)
                      } else {
                        updateNewIssue('modlogs', file)
                      }
                    }}
                    type='file'
                  />
                </Button>
              </Grid>
              <Grid
                alignContent='right'
                item
                lg={6}
                sx={{ textAlign: 'right' }}
              >
                <Button
                  endIcon={<SendIcon />}
                  onClick={handleFormSubmit}
                  variant='contained'
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </FormControl>
    </div>
  )
}
