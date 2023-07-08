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
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import AddCommentIcon from '@mui/icons-material/AddComment'

import * as api from '~/api'
import DateTime from './DateTime'

export const IssueComment = ({ comment, updateIssue }) => {
  const [menuOpen, setMenuOpen] = useState(null)

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
    <Card sx={{ mt: 5 }}>
      <CardContent>
        <Grid
          alignItems='top'
          container
          direction='row'
          justifyContent='space-between'
        >
          <Grid item lg={0.3} md={1} sx={{ pr: 1, pt: 1 }}>
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
            <div dangerouslySetInnerHTML={{ __html: comment.comment }}></div>
          </Grid>
          <Grid item lg={3} md={3} sx={{ textAlign: 'right' }}>
            <DateTime
              data={
                comment.updated_at ? comment.updated_at : comment.created_at
              }
              isUpdate={comment.updated_at ? true : false}
            />
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
  let [show, setShow] = useState(false)

  const editorRef = useRef(null)
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
          {/* <Button ></Button>Add Comment</Typography> */}
          <Button
            endIcon={<AddCommentIcon />}
            onClick={() => setShow(!show)}
            variant='outlined'
          >
            Comment
          </Button>
        </Grid>
        <Grid item lg={12} sx={{ display: show ? '' : 'none' }}>
          <Editor
            apiKey='dtvbj54k907ax86riigixvtbjry1ve8he1ys3jkh3qemdu3o'
            init={{
              content_css: 'dark',
              height: 300,
              icons: 'material',
              menubar: false,
              plugins: [
                'advlist',
                'autolink',
                'lists',
                'link',
                'image',
                'charmap',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'code',
                'help',
                'wordcount',
              ],
              skin: 'oxide-dark',
              // skin: 'naked',
              statusbar: false,
              toolbar:
                'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
            }}
            // initialValue='<h3>Add Comment</h3>'
            onEditorChange={(e) => setComment(e)}
            onInit={(evt, editor) => (editorRef.current = editor)}
            // value={comment}
          />
        </Grid>
        <Grid
          item
          lg={12}
          sx={{ display: show ? '' : 'none', textAlign: 'right' }}
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
