import React, { useState, useEffect, useContext } from 'react'
import { UserContext, CategoriesContext } from '~/context'
import { useParams, useNavigate } from 'react-router-dom'

import {
  Grid,
  // Avatar,
  Box,
  Typography,
  CardContent,
  Card,
  Tabs,
  Tab,
  Button,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

import * as api from '~/api'

import Loading from '~/components/Loading'
import { CreateIssueComment, IssueComment } from '../components/IssueComment'
import IssueAttachments from '../components/Issue/Attachments'
import ModLogs from '../components/Issue/ModLogs'
import IssueDetails from '../components/Issue/Details'

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
                    <IssueDetails issue={issue} />
                  </TabPanel>
                  <TabPanel index={1} value={tabValue}>
                    <IssueAttachments issue={issue} />
                  </TabPanel>
                  <TabPanel index={2} value={tabValue}>
                    <ModLogs issue={issue} />
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
