import React, { useState, useEffect, useContext } from 'react'
import * as api from '~/api'
import { toTitleCase } from '~/utils'

import {
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  MenuItem,
  Button,
  Stack,
  Grid,
} from '@mui/material/'
import RadioGroup from '@mui/material/RadioGroup'
import SendIcon from '@mui/icons-material/Send'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { CategoriesContext, UserContext } from '~/context'
import Loading from '~/components/Loading'

export const CreateIssue = () => {
  const userInfo = useContext(UserContext)
  const categories = useContext(CategoriesContext)

  let params = useParams()
  let location = useLocation()
  let navigate = useNavigate()

  const [version, setVersion] = useState(location.state?.version || '')
  const [modlogsButtonColor, setModlogsButtonColor] = useState('primary')
  const [modlogsButtonText, setModlogsButtonText] = useState('Upload Modlogs')
  const [embedHelperValidation, setEmbedHelperValidation] = useState('')
  const [generalHelperValidation, setGeneralHelperValidation] = useState('')
  const [embedFieldColor, setEmbedFieldColor] = useState('primary')
  const [generalFieldColor, setgeneralFieldColor] = useState('primary')

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
    description: location.state?.description || '',
    discord_id:
      location.state?.discord_id ||
      (!userInfo.user.discord_id || null ? '' : userInfo.user.discord_id),
    modlogs: {
      body: location.state?.modlogs.body || '',
      title: location.state?.modlogs.title || '',
    },
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
    } else {
      let issue = { ...newIssue }
      issue[field] = value

      setNewIssue(issue)
    }
  }

  useEffect(() => {
    if (!version) {
      api
        .requests('get', '/api/project/63fe47296edfc3b387628861')
        .then((data) => setVersion(data.version))
    }
  }, [version, location])

  useEffect(() => {
    if (
      newIssue.attachments.generalUrl.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
      )
    ) {
      setGeneralHelperValidation('Valid URL!')
      setgeneralFieldColor('success')
    } else {
      setGeneralHelperValidation('Please enter a valid URL')
      setgeneralFieldColor('warning')
    }

    if (newIssue.attachments.embedSource.includes('iframe')) {
      setEmbedHelperValidation('Valid Embed!')
      setEmbedFieldColor('success')
    } else {
      setEmbedHelperValidation('Please enter a valid embed link')
      setEmbedFieldColor('warning')
    }
  }, [newIssue])

  const handleFormSubmit = async () => {
    if (newIssue.summary !== '') {
      let issue = {
        ...newIssue,
        version: version,
      }
      let promise

      if (location.state?.id) {
        promise = api.requests('put', `/api/issue/${location.state.id}`, {
          alert: true,
          alertMessage: `Successfully update "${
            issue.summary
          }" with status "${toTitleCase(issue.status)}"`,
          data: {
            issue: { ...issue, id: location.state.id },
            userInfo: userInfo.user,
          },
        })
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
          description: '',
          discord_id:
            !userInfo.user.discord_id || null ? '' : userInfo.user.discord_id,
          modlogs: {
            body: '',
            title: '',
          },
          priority: 'medium',
          project_id: params.projectId,
          status: 'reported',
          summary: '',
          type: 'bug',
          version: '',
        })

        if (location.state?.id) {
          navigate(`/issue/${location.state.id}`)
        }
      })
    } else {
      window.alert('Please fill out all of the required fields!')
    }
  }

  if (categories === undefined) {
    return <Loading />
  }

  return (
    <div>
      <FormControl>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item md={12}>
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

          <Grid item md={4}>
            <Grid container>
              <Grid item md={12}>
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
                  {categories &&
                    categories.map((category) => (
                      <MenuItem
                        key={toTitleCase(category)}
                        value={toTitleCase(category)}
                      >
                        {toTitleCase(category)}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item md={12}>
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
              <Grid item md={12}>
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

          <Grid item md={2}>
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

          <Grid item md={2}>
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

          <Grid item md={2}>
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

          <Grid item md={12}>
            <TextField
              fullWidth
              id='description'
              label='Description'
              maxRows={20}
              minRows={6}
              multiline
              onChange={(e) => updateNewIssue('description', e.target.value)}
              placeholder='Description'
              value={newIssue.description}
              variant='filled'
            />
          </Grid>
          <Grid item md={6}>
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
          <Grid item md={6}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <FormLabel id='attachments-group' sx={{ pt: 3 }}>
                  Attachments
                </FormLabel>
              </Grid>
              <Grid item md={6}>
                <TextField
                  color={embedFieldColor}
                  fullWidth
                  helperText={embedHelperValidation}
                  id='embed'
                  label='Embed'
                  onChange={(e) =>
                    updateNewIssue('attachmentsEmbedSource', e.target.value)
                  }
                  placeholder='Embed'
                  // defaultValue={
                  //   newIssue && newIssue.attachments.embedSource
                  //     ? newIssue.attachments.embedSource
                  //     : "Embed"
                  // }
                  value={newIssue.attachments.embedSource}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  color={generalFieldColor}
                  fullWidth
                  helperText={generalHelperValidation}
                  id='generic'
                  label='URL'
                  onChange={(e) =>
                    updateNewIssue('attachmentsUrl', e.target.value)
                  }
                  placeholder='URL'
                  // defaultValue={
                  //   newIssue && newIssue.attachments.generalUrl
                  //     ? newIssue.attachments.generalUrl
                  //     : "Embed"
                  // }
                  value={newIssue.attachments.generalUrl}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Stack direction='row' spacing={2}>
              <Button
                endIcon={<SendIcon />}
                onClick={handleFormSubmit}
                variant='contained'
              >
                Submit
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </FormControl>
    </div>
  )
}
