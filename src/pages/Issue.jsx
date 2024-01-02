import React, { useState, useEffect, useContext } from 'react'
import { UserContext, ProjectsContext } from '~/context'
import { useParams, useNavigate } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar'

import {
  Grid,
  Typography,
  CardContent,
  Card,
  Tabs,
  Tab,
  IconButton,
  ListItemText,
  ListItemIcon,
  MenuItem,
  Divider,
  Menu,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import ArchiveIcon from '@mui/icons-material/Archive'
import UnarchiveIcon from '@mui/icons-material/Unarchive'
import AddCommentIcon from '@mui/icons-material/AddComment'

import * as api from '~/api'
import { toTitleCase } from '~/utils'
import { dispatchAlert } from '~/store'
import { TabPanel } from '../components/TabPanel'
import Loading from '~/components/Loading'
import { IssueCommentInput, IssueComment } from '../components/IssueComment'
import Assignments from '../components/Issue/Assignments'
import IssueAttachments from '../components/Issue/Attachments'
import ModLogs from '../components/Issue/ModLogs'
import IssueDetails from '../components/Issue/Details'

export const IssuePage = () => {
  let params = useParams()
  let navigate = useNavigate()
  let [issue, setIssue] = useState(null)
  let [tabValue, setTabValue] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [commentOpen, setCommentOpen] = useState(false)
  const [hasMaintainer, setHasMaintainer] = useState(false)
  const [canEdit, setCanEdit] = useState(false)

  const userInfo = useContext(UserContext)
  const { project } = useContext(ProjectsContext)

  useEffect(() => {
    const findProject = userInfo.user.projects.find(
      (el) => el.id === project?.id,
    )
    if (findProject) {
      const roles = findProject.roles

      roles.forEach((el) => {
        if (el === 'maintainer') {
          setHasMaintainer(true)
        }
      })
      // Add a condition to check if issue exists before accessing its properties
      setCanEdit(
        hasMaintainer || issue?.discord_id === userInfo.user.discord_id,
      )
    }
  }, [issue, userInfo.user.discord_id])

  const handleTabChange = (_, tab) => {
    setTabValue(tab)
  }

  const fetchIssue = () => {
    api
      .requests('get', `/api/issue/${params.issueId}`)
      .then((data) => setIssue(data))
    setCommentOpen(false)
  }

  const handleDelete = () => {
    api
      .requests('delete', `/api/issue/${issue.id}`, {
        alert: true,
        alertMessage: `Successfully deleted "${
          issue.summary
        }" with status "${toTitleCase(issue.status)}"`,
      })
      .then(() => {
        navigate(`/project/${issue.project_id}/issues/${issue.category}`)
      })
  }

  const handleArchive = () => {
    let newIssue = { ...issue }
    if (
      newIssue.status === 'completed' ||
      newIssue.status === "won't-fix" ||
      newIssue.archived
    ) {
      newIssue.archived = !newIssue.archived

      if (newIssue.archived) {
        newIssue.status = 'reported'
      }

      api
        .requests('put', `/api/issue/${newIssue.id}`, {
          alert: true,
          alertMessage: `Successfully updated "${
            newIssue.summary
          }" with status "${toTitleCase(newIssue.status)}"`,
          data: { issue: newIssue, userInfo: userInfo.user },
        })
        .then(() => {
          setIssue(newIssue)
        })
    } else {
      dispatchAlert({
        message:
          'Status must be "Completed" or "Won\'t Fix" in order to archive',
        type: 'error',
      })
    }
  }

  useEffect(() => {
    if (issue === null) {
      fetchIssue()
    }
  })

  if (!issue || !project === undefined) {
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
                <Grid item lg={1} sx={{ mt: 0.5, textAlign: 'right' }}>
                  <IconButton
                    aria-controls={menuOpen ? 'menu' : undefined}
                    aria-expanded={menuOpen ? 'true' : undefined}
                    aria-haspopup='true'
                    onClick={(e) => {
                      setMenuOpen(e.currentTarget)
                    }}
                    sx={{ pt: 1 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuOpen}
                    anchorOrigin={{
                      horizontal: 'right',
                      vertical: 'bottom',
                    }}
                    id='menu'
                    onClick={() => setMenuOpen(null)}
                    onClose={() => setMenuOpen(null)}
                    open={Boolean(menuOpen)}
                    transformOrigin={{
                      horizontal: 'right',
                      vertical: 'top',
                    }}
                  >
                    <MenuItem onClick={() => setCommentOpen(!commentOpen)}>
                      <ListItemIcon>
                        <AddCommentIcon color='white' />
                      </ListItemIcon>
                      <ListItemText>Comment</ListItemText>
                    </MenuItem>
                    {canEdit && (
                      <div>
                        <MenuItem
                          onClick={() =>
                            navigate(
                              `/project/${params.projectId}/create-issue`,
                              {
                                state: issue,
                              },
                            )
                          }
                        >
                          <ListItemIcon>
                            <EditIcon color='white' />
                          </ListItemIcon>
                          <ListItemText>Edit</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleArchive()}>
                          <ListItemIcon>
                            {issue.archived ? (
                              <UnarchiveIcon color='warning' />
                            ) : (
                              <ArchiveIcon color='warning' />
                            )}
                          </ListItemIcon>
                          {issue.archived ? (
                            <ListItemText>Unarchive</ListItemText>
                          ) : (
                            <ListItemText>Archive</ListItemText>
                          )}
                        </MenuItem>

                        <Divider />
                        <MenuItem onClick={() => handleDelete()}>
                          <ListItemIcon>
                            <DeleteIcon color='error' />
                          </ListItemIcon>
                          <ListItemText>Delete</ListItemText>
                        </MenuItem>
                      </div>
                    )}
                  </Menu>
                </Grid>

                <Grid item lg={12} sx={{ mt: 5 }}>
                  <Tabs
                    onChange={handleTabChange}
                    value={tabValue}
                    variant='fullWidth'
                  >
                    <Tab id='Details' label='Details' />
                    <Tab id='attachments' label='Attachments' />
                    <Tab id='mog-logs' label='Mod Logs' />
                    <Tab id='assignments' label='Assignments' />
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
                  <TabPanel index={3} value={tabValue}>
                    <Assignments issue={issue} />
                  </TabPanel>
                </Grid>
              </Grid>
            </CardContent>
            {issue.assignments && <ProgressBar count={issue.assignments} />}
          </Card>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item lg={12} sx={{ display: tabValue === 0 ? '' : 'none' }}>
          <IssueCommentInput
            height={600}
            issueId={issue.id}
            show={commentOpen}
            updateIssue={() => fetchIssue()}
          />
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
