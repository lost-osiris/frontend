import React, { useState } from 'react'

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'

import * as api from '~/api'

export const IssueComment = ({ comment, updateIssue }) => {
  const [menuOpen, setMenuOpen] = useState(null)
  const createAt = new Date(comment.created_at)

  const deleteComment = () => {
    api
      .requests('delete', `/api/comment/${comment.id}`, {
        alert: true,
        alertMessage: 'Successfully deleted comment',
      })
      .then(() => {
        updateIssue()
      })
  }

  return (
    <Card>
      <CardContent>
        <Grid
          alignItems='center'
          container
          direction='row'
          justifyContent='space-between'
        >
          <Grid item lg={0.3} md={1} sx={{ pr: 1 }}>
            <Avatar
              src={`https://cdn.discordapp.com/avatars/${comment.discord_id}/${comment.discord.avatar}.png`}
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
          <Grid item lg={8.7} md={8}>
            <Typography sx={{ pl: 1 }} variant='body'>
              {comment.comment}
            </Typography>
          </Grid>
          <Grid item lg={3} md={3} sx={{ textAlign: 'right' }}>
            <Typography sx={{ mr: 3 }} variant='overline'>
              {createAt.toISOString()}
            </Typography>
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
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              id='menu'
              onClick={() => setMenuOpen(null)}
              onClose={() => setMenuOpen(null)}
              open={Boolean(menuOpen)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <MenuItem>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>

              <Divider />
              <MenuItem onClick={() => deleteComment()}>
                <ListItemIcon>
                  <CloseIcon color='error' fontSize='small' />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export const CreateIssueComment = ({ issue, updateIssue }) => {
  let [comment, setComment] = useState('')
  const submitComment = () => {
    api
      .requests('post', `/api/issue/${issue.id}/comment`, {
        alert: true,
        alertMessage: 'Successfully created comment',
        data: {
          comment: comment,
        },
      })
      .then(() => {
        setComment('')
        updateIssue()
      })
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item lg={12}>
          <TextField
            fullWidth
            label='Create comment'
            maxRows={20}
            minRows={6}
            multiline
            onChange={(e) => setComment(e.target.value)}
            placeholder='Create comment'
            value={comment}
            variant='filled'
          />
        </Grid>
        <Grid item lg={12} sx={{ textAlign: 'right' }}>
          <Button onClick={submitComment} variant='contained'>
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}
