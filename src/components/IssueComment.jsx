import React, { useState, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

import {
  Card,
  CardContent,
  // Typography,
  Grid,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  ButtonGroup,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import AddCommentIcon from '@mui/icons-material/AddComment'

import * as api from '~/api'
import DateTime from './DateTime'
import TinyMce from './TinyMce'

export const IssueComment = ({ comment, updateIssue }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [toggleEdit, setEdit] = useState(false)

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
    <Card
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(toggleEdit)}
      sx={{ mt: 5 }}
    >
      <CardContent>
        <Grid
          alignItems='top'
          container
          direction='row'
          justifyContent='space-between'
        >
          <Grid item lg={5} md={1} sx={{ pt: 1 }}>
            {/* <Box variant='span'> */}
            <Grid container>
              <Grid item>
                <Avatar
                  src={`https://cdn.discordapp.com/avatars/${comment.discord_id}/${comment.discord.avatar}.png`}
                  sx={{
                    // mt: 0.7,
                    height: 50,
                    ml: 0,
                    width: 50,
                    // cursor: "pointer",
                    // ":hover": {
                    //   boxShadow:
                    //     "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0.12)",
                    // },
                  }}
                  // onClick={() => navigate(`/user/${issue.discord_id}`)}
                />
              </Grid>
              <Grid item sx={{ ml: 2, pt: 1 }}>
                <Typography variant='h6'>{comment.discord.username}</Typography>
              </Grid>
            </Grid>
            {/* </Box> */}
          </Grid>
          <Grid item lg={3} md={3} sx={{ textAlign: 'right', pt: 1 }}>
            <Box sx={{ display: menuOpen ? '' : 'none' }}>
              {toggleEdit ? (
                <Button
                  color='white'
                  endIcon={<CloseIcon />}
                  onClick={() => setEdit(!toggleEdit)}
                  variant='outlined'
                >
                  Close Edit
                </Button>
              ) : (
                <Button
                  color='white'
                  endIcon={<EditIcon />}
                  onClick={() => setEdit(!toggleEdit)}
                  variant='outlined'
                >
                  Edit
                </Button>
              )}
              <Button
                color='error'
                endIcon={<DeleteIcon />}
                onClick={() => deleteComment()}
                sx={{ ml: 2 }}
                variant='outlined'
              >
                Delete
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ pt: 2 }} />
        <Grid
          item
          lg={12}
          sx={{
            display: toggleEdit ? 'none' : '',
            p: 2,
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: comment.comment }}></div>
        </Grid>
        <Grid
          item
          lg={12}
          sx={{
            display: toggleEdit ? '' : 'none',
            pb: 2,
            pl: 2,
            pr: 2,
          }}
        >
          <IssueCommentInput
            comment={comment.comment}
            show={toggleEdit}
            updateIssue={() => updateIssue()}
          />
        </Grid>
        <Grid
          item
          lg={12}
          sx={{
            display: toggleEdit ? 'none' : '',
            textAlign: 'right',
          }}
        >
          <DateTime
            data={comment.updated_at ? comment.updated_at : comment.created_at}
            isUpdate={comment.updated_at ? true : false}
          />
        </Grid>
      </CardContent>
    </Card>
  )
}

export const IssueCommentInput = ({
  issue,
  updateIssue,
  show,
  height,
  ...props
}) => {
  let [comment, setComment] = useState(props.comment || '')

  const submitComment = () => {
    let method = 'post'
    let message = 'Successfully created comment'
    if (props.comment) {
      method = 'put'
      message = 'Successfully updated comment'
    }

    api
      .requests(method, `/api/issue/${issue.id}/comment`, {
        alert: true,
        alertMessage: message,
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
      <Grid container sx={{ mt: 5 }}>
        <Grid item lg={12} sx={{ display: show ? '' : 'none' }}>
          <TinyMce
            height={height}
            onChange={(e) => setComment(e)}
            value={comment}
          />
        </Grid>
        <Grid
          item
          lg={12}
          sx={{
            display: show ? '' : 'none',
            mt: 3,
            textAlign: 'right',
          }}
        >
          <Button
            endIcon={<SendIcon />}
            onClick={submitComment}
            variant='outlined'
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}
