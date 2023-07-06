import React, { useState, useContext } from 'react'
import { UserContext } from '~/context'
import { useNavigate } from 'react-router-dom'
import { useDrag } from 'react-dnd'
import { CardChip } from '~/components/Chip'
import { HighPriorityIcon } from '~/components/HighPrioIcon'
import { LowPriorityIcon } from '~/components/LowPrioIcon'
import { MediumPriorityIcon } from '~/components/MediumPrioIcon'

import * as api from '~/api'
import { toTitleCase } from '~/utils'

import {
  Card,
  CardContent,
  IconButton,
  Menu,
  Box,
  Grid,
  Typography,
  Divider,
  ListItemText,
  ListItemIcon,
  MenuItem,
  Avatar,
  Stack,
} from '@mui/material'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import CloseIcon from '@mui/icons-material/Close'
import ArchiveIcon from '@mui/icons-material/Archive'
import UnarchiveIcon from '@mui/icons-material/Unarchive'
import BugReportIcon from '@mui/icons-material/BugReport'
import SuggectionIcon from '@mui/icons-material/TipsAndUpdates'

export const IssueCard = ({ issue, sx, ...props }) => {
  const [menuOpen, setMenuOpen] = useState(null)
  const userInfo = useContext(UserContext)
  const navigate = useNavigate()
  const issueSummary =
    issue.summary.charAt(0).toUpperCase() + issue.summary.slice(1)
  let project = userInfo.user.projects.find((value) => value)

  const hasMaintainer = project.roles.indexOf('maintainer') === 0 ? true : false

  const canEdit = hasMaintainer || issue.discord_id === userInfo.user.discord_id

  const handleCardDelete = () => {
    api
      .requests('delete', `/api/issue/${issue.id}`, {
        alert: true,
        alertMessage: `Successfully deleted "${
          issue.summary
        }" with status "${toTitleCase(issue.status)}"`,
      })
      .then(() => {
        if (props.onDelete) {
          props.onDelete()
        }
      })
  }

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: {
      issue: issue,
    },
    type: 'issue',
  }))

  let cardProps = { sx: { opacity: isDragging ? 0 : 1 } }

  if (!issue.archived && canEdit) {
    cardProps.ref = drag
  }

  return (
    <Card
      ref={preview}
      {...cardProps}
      sx={{
        ...sx,
        '&:hover': {
          boxShadow:
            canEdit && !issue.archived && !isDragging
              ? '0px 2px 15px 0px rgba(255,255,255,0.3)'
              : '',
        },
        ml: 1,
        mr: 1,
        opacity: isDragging ? 0.25 : 1,
        p: 0,
      }}
    >
      <CardContent
        sx={{
          cursor: canEdit && !issue.archived ? 'grab !important' : '',
          mb: 0,
          paddingBottom: '16px !important',
          paddingTop: '8px !important',
          pl: 2,
          pr: 2,
        }}
      >
        {!userInfo && (
          <Grid container>
            <Grid item lg={12}>
              <Box
                component='h4'
                sx={{
                  mt: 1,
                }}
              >
                <Box
                  component='span'
                  onClick={() => navigate(`/issue/${issue.id}`)}
                  sx={{
                    '&:hover': {
                      // cursor: 'pointer',
                      opacity: [0.9, 0.8, 0.7],
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <Typography>{issueSummary}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
        <Grid container>
          <Grid item lg={10.5}>
            <Box
              component='h4'
              sx={{
                mt: 1,
              }}
            >
              <Box
                component='span'
                onClick={() => navigate(`/issue/${issue.id}`)}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    opacity: [0.9, 0.8, 0.7],
                    textDecoration: 'underline',
                  },
                }}
              >
                {issueSummary}
              </Box>
            </Box>
          </Grid>
          {userInfo && canEdit && (
            <Grid item lg={1.5}>
              <IconButton
                aria-controls={menuOpen ? 'menu' : undefined}
                aria-expanded={menuOpen ? 'true' : undefined}
                aria-haspopup='true'
                onClick={(e) => {
                  setMenuOpen(e.currentTarget)
                }}
                sx={{ pt: 1 }}
              >
                <MoreHorizIcon />
              </IconButton>
              <Menu
                anchorEl={menuOpen}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                id='menu'
                onClick={() => setMenuOpen(null)}
                onClose={() => setMenuOpen(null)}
                open={Boolean(menuOpen)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              >
                <MenuItem
                  onClick={() => {
                    if (
                      issue.status === 'completed' ||
                      issue.status === "won't-fix"
                    ) {
                      issue.archived = !issue.archived
                      let data = {
                        issue,
                        userInfo: userInfo.user,
                      }

                      api.requests('put', `/api/issue/${props.issue.id}`, data)
                    } else {
                      window.alert(
                        'Status must be "Completed" or "Won\'t Fix" in order to archive',
                      )
                    }
                  }}
                >
                  <ListItemIcon>
                    {issue.archived ? (
                      <UnarchiveIcon color='warning' fontSize='small' />
                    ) : (
                      <ArchiveIcon color='warning' fontSize='small' />
                    )}
                  </ListItemIcon>
                  {issue.archived ? (
                    <ListItemText>Unarchive</ListItemText>
                  ) : (
                    <ListItemText>Archive</ListItemText>
                  )}
                </MenuItem>

                <Divider />
                <MenuItem onClick={handleCardDelete}>
                  <ListItemIcon>
                    <CloseIcon color='error' fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </Menu>
            </Grid>
          )}
        </Grid>
        <Grid container justifyContent='space-between' spacing={1}>
          <Grid item justifyContent='left' sx={{ mt: 1 }}>
            <Stack direction='row' spacing={1}>
              {issue.type === 'bug' && (
                <CardChip color='info' img={<BugReportIcon />} label='Type' />
              )}
              {issue.type === 'suggestion' && (
                <CardChip color='info' img={<SuggectionIcon />} label='Type' />
              )}
              {issue.priority === 'low' && (
                <CardChip
                  color='info'
                  img={<LowPriorityIcon />}
                  label='Priority'
                />
              )}
              {issue.priority === 'medium' && (
                <CardChip
                  color='warning'
                  img={<MediumPriorityIcon />}
                  label='Priority'
                />
              )}
              {issue.priority === 'high' && (
                <CardChip
                  color='error'
                  img={<HighPriorityIcon />}
                  label='Priority'
                />
              )}
            </Stack>
          </Grid>
          <Grid item justifyContent='right' sx={{ mt: 1 }}>
            <Typography variant='button'>{issue.version}</Typography>
          </Grid>

          <Grid item justifyContent='right'>
            <Avatar
              src={`https://cdn.discordapp.com/avatars/${issue.discord_id}/${issue.playerData.avatar}.png`}
              sx={{
                mr: 1,
                mt: 0.7,
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
      </CardContent>
    </Card>
  )
}
