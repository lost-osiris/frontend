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
      {/* <Grid container sx={{ mb: 4 }}>
        <Grid item>
          <Typography variant='h3'>{issue.summary}</Typography>
        </Grid>
      </Grid> */}
      <Grid container>
        <Grid item lg={12}>
          <Card>
            <CardContent>
              <Grid container>
                <Grid item lg={canEdit ? 11 : 10}>
                  <Typography
                    sx={{
                      pb: 1,
                      pl: 3,
                      pr: 3,
                      pt: 1,
                    }}
                    variant='h3'
                  >
                    {issue.summary}
                  </Typography>
                </Grid>
                {canEdit && (
                  <Grid item lg={1} sx={{ mt: 0.5, textAlign: 'right' }}>
                    <Button
                      endIcon={<EditIcon />}
                      onClick={() =>
                        navigate(
                          '/project/63fe47296edfc3b387628861/create-issue',
                          {
                            state: issue,
                          },
                        )
                      }
                      size='md'
                      variant='outlined'
                    >
                      Edit
                    </Button>
                  </Grid>
                )}
                <Grid item lg={12} sx={{ mt: 5 }}>
                  <Tabs
                    onChange={handleTabChange}
                    value={tabValue}
                    variant='fullWidth'
                  >
                    <Tab id='Details' label='Details' />
                    <Tab id='attachments' label='Attachments' />
                    <Tab id='mog-logs' label='Mod Logs' />
                  </Tabs>
                  <TabPanel index={0} value={tabValue}>
                    <Grid container>
                      <Grid item lg={12} sx={{ mt: 2 }}>
                        <Box component='span'>
                          <Grid
                            container
                            direction='row'
                            justifyContent='left'
                            spacing={1}
                          >
                            <Grid item>
                              <Typography variant='overline'>
                                Status:
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography
                                sx={{
                                  bgcolor: getStatusColorHk(
                                    issue.archived ? 'archived' : issue.status,
                                  ),
                                  borderColor: getStatusColorHk(
                                    issue.archived ? 'archived' : issue.status,
                                  ),
                                  borderRadius: '5px',
                                  ml: 2,
                                  mr: 2,
                                  opacity: 0.9,
                                  pl: 2,
                                  pr: 2,
                                }}
                                textAlign='center'
                                variant='h6'
                              >
                                {issue.archived
                                  ? 'Archived'
                                  : issue.status
                                      .split(' ')
                                      .map((s) => toTitleCase(s))
                                      .join(' ')}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                      <Grid item lg={2}>
                        <Grid item lg={12} sx={{ mt: 3 }}>
                          <Box component='span'>
                            <Grid
                              container
                              direction='row'
                              justifyContent='left'
                              spacing={1}
                            >
                              <Grid item>
                                <Typography variant='overline'>
                                  Type:
                                </Typography>
                              </Grid>
                              <Grid item>
                                {issue.type === 'bug' && (
                                  <BugReportIcon
                                    color='warning'
                                    sx={{
                                      fontSize: '3rem',
                                      ml: 6.5,
                                      mt: -1.5,
                                    }}
                                  />
                                )}
                                {issue.type === 'suggestion' && (
                                  <SuggectionIcon
                                    sx={{
                                      fontSize: '3rem',
                                      ml: 7.5,
                                      mt: -1.5,
                                    }}
                                  />
                                )}
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                        <Grid item lg={12} sx={{ mt: 2 }}>
                          <Box component='span'>
                            <Grid
                              container
                              direction='row'
                              justifyContent='left'
                              spacing={1}
                            >
                              <Grid item>
                                <Typography variant='overline'>
                                  Priority:
                                </Typography>
                              </Grid>
                              <Grid item>
                                {issue.priority === 'low' && (
                                  <DoubleArrowIcon
                                    color='info'
                                    sx={{
                                      fontSize: '3rem',
                                      ml: 3,
                                      mt: -1.5,
                                      transform: 'rotate(90deg)',
                                    }}
                                  />
                                )}
                                {issue.priority === 'medium' && (
                                  <DragHandleIcon
                                    color='warning'
                                    sx={{
                                      fontSize: '3rem',
                                      ml: 3,
                                      mt: -1.5,
                                    }}
                                  />
                                )}
                                {issue.priority === 'high' && (
                                  <DoubleArrowIcon
                                    color='error'
                                    sx={{
                                      fontSize: '3rem',
                                      ml: 3,
                                      mt: -1.5,
                                      transform: 'rotate(-90deg)',
                                    }}
                                  />
                                )}
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                        <Grid item lg={12} sx={{ mt: 2 }}>
                          <Box component='span'>
                            <Grid
                              container
                              direction='row'
                              justifyContent='left'
                              spacing={1}
                            >
                              <Grid item>
                                <Typography variant='overline'>
                                  Category:
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography sx={{ ml: 1.5 }} variant='body'>
                                  {toTitleCase(issue.category)}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                        <Grid item lg={12} sx={{ mt: 3 }}>
                          <Box component='span'>
                            <Grid
                              container
                              direction='row'
                              justifyContent='left'
                              spacing={1}
                            >
                              <Grid item>
                                <Typography variant='overline'>
                                  Version:
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography sx={{ ml: 3 }} variant='body'>
                                  {issue.version}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                          <Grid item lg={12}>
                            <Box component='span'>
                              <Grid
                                container
                                direction='row'
                                justifyContent='left'
                                spacing={1}
                              >
                                <Grid item>
                                  <Typography variant='overline'>
                                    Author:
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Avatar
                                    src={`https://cdn.discordapp.com/avatars/${issue.discord_id}/${issue.playerData.avatar}.png`}
                                    sx={{
                                      ml: 4.5,
                                      mt: -0.7,
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
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={9}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: issue.description,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container></Grid>
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container sx={{ mt: 5 }}>
        <Grid item lg={12} sx={{ display: tabValue === 0 ? '' : 'none' }}>
          <CreateIssueComment issue={issue} updateIssue={() => fetchIssue()} />
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
