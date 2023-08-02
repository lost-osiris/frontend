import React, { useState } from 'react'
import { TabPanel } from '../components/TabPanel'
import TinyMce from '../components/TinyMce'
import * as api from '~/api'

import {
  Grid,
  Button,
  Dialog,
  Toolbar,
  Typography,
  AppBar,
  Tabs,
  Tab,
  TextField,
  Divider,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox,
  Slide,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

export const CreateBlog = ({ height }) => {
  const [tabValue, setTabValue] = useState(0)
  const [open, setOpen] = useState(false)
  const [blog, setBlog] = useState({
    post: '',
    radio: '',
    tags: [],
    title: '',
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleTabChange = (_, tab) => {
    setTabValue(tab)
  }

  return (
    <div>
      <Grid container>
        <Grid item lg={12} sx={{ mt: 5 }}>
          <Tabs onChange={handleTabChange} value={tabValue} variant='fullWidth'>
            <Tab id='create-blog' label='Create Blog' />
            <Tab id='preview' label='Preview' />
          </Tabs>
          <TabPanel index={0} value={tabValue}>
            <Divider sx={{ mb: 2, mt: 2 }} />
            <Grid
              alignItems='center'
              container
              direction='row'
              justifyContent='center'
              sx={{ mb: 2, mt: 2 }}
            >
              <Grid item lg={6}>
                <TextField
                  id='standard-multiline-flexible'
                  label='Blog Title'
                  maxRows={4}
                  multiline
                  onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                  variant='outlined'
                />
              </Grid>
              <Grid item lg={6}>
                <Grid
                  alignItems='center'
                  container
                  direction={'column'}
                  justifyContent='center'
                >
                  <Grid item>
                    {' '}
                    <FormControl>
                      <FormLabel id='demo-row-radio-buttons-group-label'>
                        Tags
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby='demo-row-radio-buttons-group-label'
                        name='row-radio-buttons-group'
                        onChange={(e) =>
                          setBlog({ ...blog, radio: e.target.value })
                        }
                        row
                      >
                        <FormControlLabel
                          control={<Radio />}
                          label='Hollow Knight'
                          value='Hollow Knight'
                        />
                        <FormControlLabel
                          control={<Radio />}
                          label='Silksong'
                          value='Silksong'
                        />
                        <FormControlLabel
                          control={<Radio />}
                          label='ModForge'
                          value='ModForge'
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl>
                      <FormGroup id='tags' row sx={{ pb: 3 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={blog.tags.indexOf('Major Release') > -1}
                              onChange={(e) => {
                                let updatedBlog = { ...blog }
                                let index = updatedBlog.tags.indexOf(
                                  e.target.value,
                                )

                                if (index === -1) {
                                  updatedBlog.tags.push(e.target.value)
                                } else {
                                  updatedBlog.tags.splice(index, 1)
                                }
                                setBlog(updatedBlog)
                              }}
                            />
                          }
                          label='Major Release'
                          name='Major Release'
                          value='Major Release'
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={blog.tags.indexOf('Major Update') > -1}
                              onChange={(e) => {
                                let updatedBlog = { ...blog }
                                let index = updatedBlog.tags.indexOf(
                                  e.target.value,
                                )

                                if (index === -1) {
                                  updatedBlog.tags.push(e.target.value)
                                } else {
                                  updatedBlog.tags.splice(index, 1)
                                }
                                setBlog(updatedBlog)
                              }}
                            />
                          }
                          label='Major Update'
                          name='Major Update'
                          value='Major Update'
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <TinyMce
              height={height}
              onChange={(e) => setBlog({ ...blog, post: e })}
              value={blog.post}
            />
            <Button
              onClick={() => {
                blog.tags.push(blog.radio)
                delete blog.radio
                api.requests('post', '/api/blogs/createblog', {
                  alert: true,
                  alertMessage: 'successfully created blog post',
                  data: blog,
                })
              }}
            >
              {' '}
              Submit Blogpost
            </Button>
          </TabPanel>
          <TabPanel index={1} value={tabValue}>
            <Divider sx={{ mb: 2, mt: 2 }} />

            <Grid
              alignItems='center'
              container
              direction='column'
              justifyContent='center'
            >
              <Grid item lg={1}>
                <div>
                  <Button onClick={handleClickOpen} variant='outlined'>
                    Fullscreen preview
                  </Button>
                  <Dialog
                    fullScreen
                    onClose={handleClose}
                    open={open}
                    TransitionComponent={Transition}
                  >
                    <AppBar sx={{ position: 'relative' }}>
                      <Toolbar>
                        <Grid
                          alignItems='center'
                          container
                          justifyContent='center'
                        >
                          <IconButton
                            aria-label='close'
                            color='inherit'
                            edge='start'
                            onClick={handleClose}
                          >
                            <CloseIcon />
                          </IconButton>
                          <Typography
                            component='div'
                            sx={{ flex: 1, ml: 2 }}
                            variant='h6'
                          >
                            Close
                          </Typography>
                        </Grid>
                      </Toolbar>
                    </AppBar>
                    <div dangerouslySetInnerHTML={{ __html: blog.post }} />
                  </Dialog>
                </div>
              </Grid>
              <Grid item lg={11}>
                <div dangerouslySetInnerHTML={{ __html: blog.post }} />
              </Grid>
            </Grid>
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  )
}
