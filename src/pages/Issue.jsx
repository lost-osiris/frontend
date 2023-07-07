import React, { useState, useEffect, useContext } from 'react'
import { UserContext, CategoriesContext } from '~/context'
import { useParams, useNavigate } from 'react-router-dom'

import {
  Grid,
  Avatar,
  Box,
  Typography,
  CardContent,
  Card,
  Tabs,
  Tab,
  Button,
} from '@mui/material'
import BugReportIcon from '@mui/icons-material/BugReport'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import EditIcon from '@mui/icons-material/Edit'
import SuggectionIcon from '@mui/icons-material/TipsAndUpdates'

import * as api from '~/api'
import { getStatusColorHk, toTitleCase } from '~/utils'

import Loading from '~/components/Loading'
import { CreateIssueComment, IssueComment } from '../components/IssueComment'

const TabPanel = (props) => {
  const { children, value, index, ...other } = props
  return (
    <div hidden={value !== index} id={value} role='tabpanel' {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export const IssuePage = () => {
  let params = useParams()
  let navigate = useNavigate()
  let [issue, setIssue] = useState(null)
  let [tabValue, setTabValue] = useState(0)
  const userInfo = useContext(UserContext)
  const categories = useContext(CategoriesContext)
  let project = userInfo.user.projects.find((value) => value)

  const hasMaintainer = project.roles.indexOf('maintainer') === 0 ? true : false

  const canEdit =
    hasMaintainer || issue?.discord_id === userInfo.user.discord_id

  const handleTabChange = (_, tab) => {
    setTabValue(tab)
  }

  const fetchIssue = () => {
    api
      .requests('get', `/api/issue/${params.issueId}`)
      .then((data) => setIssue(data))
  }

  useEffect(() => {
    if (issue === null) {
      fetchIssue()
    }
  })

  if (!issue || categories === undefined) {
    return <Loading />
  }

  return (
    <div>
      <Grid container sx={{ mb: 4 }}>
        <Grid item lg={canEdit ? 11 : 10}>
          <Typography sx={{ textAlign: 'left' }} variant='h3'>
            {issue.summary}
          </Typography>
        </Grid>
        {canEdit && (
          <Grid item lg={1} sx={{ mt: 2, textAlign: 'right' }}>
            <Button
              onClick={() =>
                navigate('/project/63fe47296edfc3b387628861/create-issue', {
                  state: issue,
                })
              }
              variant='contained'
            >
              <EditIcon />
              Edit
            </Button>
          </Grid>
        )}
      </Grid>
      <Grid container>
        <Grid item lg={12}>
          <Card>
            <CardContent>
              <Grid container>
                <Grid item lg={2} sx={{ mt: 1, pl: 2 }}>
                  <Grid
                    container
                    direction='row'
                    justifyContent='left'
                    spacing={1}
                  >
                    <Grid item>
                      <Typography textAlign='center' variant='h4'>
                        {issue.playerData.username}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Avatar
                        src={`https://cdn.discordapp.com/avatars/${issue.discord_id}/${issue.playerData.avatar}.png`}
                        sx={{
                          // mt: 0.7,
                          ml: 0,
                          // cursor: "pointer",
                          // ":hover": {
                          //   boxShadow:
                          //     "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0.12)",
                          // },
                        }}
                        // onClick={() => navigate(`/user/${issue.discord_id}`)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={3}>
                  <Grid
                    container
                    direction='row'
                    justifyContent='center'
                    spacing={1}
                  >
                    <Grid item>
                      <Typography textAlign='center' variant='h4'>
                        Type:
                      </Typography>
                    </Grid>
                    <Grid item>
                      {issue.type === 'bug' && (
                        <BugReportIcon
                          color='warning'
                          sx={{ fontSize: '3rem' }}
                        />
                      )}
                      {issue.type === 'suggestion' && (
                        <SuggectionIcon sx={{ fontSize: '3rem' }} />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={3}>
                  <Grid
                    container
                    direction='row'
                    justifyContent='center'
                    spacing={1}
                  >
                    <Grid item>
                      <Typography textAlign='center' variant='h4'>
                        Priority:
                      </Typography>
                    </Grid>
                    <Grid item>
                      {issue.priority === 'low' && (
                        <DoubleArrowIcon
                          color='info'
                          sx={{
                            fontSize: '3rem',
                            transform: 'rotate(90deg)',
                          }}
                        />
                      )}
                      {issue.priority === 'medium' && (
                        <DragHandleIcon
                          color='warning'
                          sx={{ fontSize: '3rem' }}
                        />
                      )}
                      {issue.priority === 'high' && (
                        <DoubleArrowIcon
                          color='error'
                          sx={{
                            fontSize: '3rem',
                            transform: 'rotate(-90deg)',
                          }}
                        />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={4}>
                  <Typography
                    sx={{
                      bgcolor: getStatusColorHk(issue.status),
                      borderColor: getStatusColorHk(issue.status),
                      borderRadius: '5px',
                      opacity: 0.9,
                    }}
                    textAlign='center'
                    variant='h4'
                  >
                    {issue.status
                      .split(' ')
                      .map((s) => toTitleCase(s))
                      .join(' ')}
                  </Typography>
                </Grid>
                <Grid item lg={12} sx={{ mt: 5 }}>
                  <Tabs
                    onChange={handleTabChange}
                    value={tabValue}
                    variant='fullWidth'
                  >
                    <Tab id='Description' label='Description' />
                    <Tab id='attachments' label='Attachments' />
                    <Tab id='mog-logs' label='Mod Logs' />
                  </Tabs>
                  <TabPanel index={0} value={tabValue}>
                    <Grid container>
                      <Grid item lg={12}>
                        <Typography variant='h5'>
                          {issue.description || ''}
                        </Typography>
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel index={1} value={tabValue}>
                    {!issue.attachments.embedSource &
                    !issue.attachments.generalUrl ? (
                      <Grid container justifyContent='center'>
                        <Grid item>
                          <Typography
                            sx={{ fontStyle: 'italic', textAlign: 'center' }}
                            variant='h6'
                          >
                            No Attachments Set
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : (
                      <>
                        <Grid container justifyContent='center'>
                          <Grid item>
                            <Box
                              component='span'
                              onClick={() =>
                                window.open(
                                  issue.attachments.generalUrl,
                                  '_blank',
                                )
                              }
                              sx={{
                                '&:hover': {
                                  cursor: 'pointer',
                                  opacity: [0.9, 0.8, 0.7],
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontStyle: 'italic',
                                  textAlign: 'center',
                                }}
                                variant='h6'
                              >
                                View Attachment URL
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        <Grid container justifyContent='center' sx={{ mt: 2 }}>
                          {issue.attachments.generalUrl && (
                            <Grid item>
                              <iframe
                                src={`${issue.attachments.generalUrl}`}
                                style={{
                                  height: '95vh',
                                  overflow: 'visible',
                                  width: '75vw',
                                }}
                                title='issue-attachment-general-url'
                              />
                            </Grid>
                          )}
                          {issue.attachments.embedSource && (
                            <Grid item>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: issue.attachments.embedSource,
                                }}
                              ></div>
                            </Grid>
                          )}
                        </Grid>
                      </>
                    )}
                  </TabPanel>
                  <TabPanel index={2} value={tabValue}>
                    <Grid container justifyContent='center'>
                      <Grid item>
                        <Typography
                          sx={{ fontStyle: 'italic', textAlign: 'center' }}
                          variant='h6'
                        >
                          {issue.modlogs.title}
                        </Typography>
                      </Grid>
                    </Grid>
                    <pre>{issue.modlogs.body}</pre>
                  </TabPanel>
                </Grid>
              </Grid>
              <Grid item lg={12}>
                <CreateIssueComment
                  issue={issue}
                  updateIssue={() => fetchIssue()}
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container sx={{ mt: 5 }}>
        <Grid item lg={12}>
          {issue.comments.map((el) => {
            return (
              <IssueComment
                comment={el}
                key={`issue-comment-${el.id}`}
                updateIssue={() => fetchIssue()}
              />
            )
          })}
        </Grid>
      </Grid>
    </div>
  )
}
