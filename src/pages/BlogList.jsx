import React, { useState, useEffect, useContext, useRef } from 'react'
import * as api from '~/api'
import DateTime from '../components/DateTime'
import { UserContext } from '../context/Authentication'
import { getBlogColor, getImage } from '../utils'
import { useNavigate } from 'react-router-dom'
import theme from '~/theme'

import {
  Avatar,
  Typography,
  Button,
  Grid,
  Box,
  Chip,
  List,
  ListItem,
  ListItemButton,
  Slide,
} from '@mui/material'

export const BlogList = () => {
  const userInfo = useContext(UserContext)
  const containerRef = useRef(null)
  const [blogs, setBlogs] = useState()
  const [checkedStates, setCheckedStates] = useState(
    blogs ? new Array(blogs.length).fill(false) : [],
  )

  let approvedIds = [
    '123361745023533058',
    '500343640871403520',
    '263426341414633473',
  ]
  let hasCerts = false
  const navigate = useNavigate()

  const handleMouseEnter = (index) => {
    setCheckedStates((prevState) => {
      const updatedStates = [...prevState]
      updatedStates[index] = true
      return updatedStates
    })
  }

  const handleMouseLeave = (index) => {
    setCheckedStates((prevState) => {
      const updatedStates = [...prevState]
      updatedStates[index] = false
      return updatedStates
    })
  }

  approvedIds.forEach((el) => {
    if (userInfo.user.discord_id === el) {
      hasCerts = true
    }
  })

  useEffect(() => {
    if (!blogs) {
      api
        .requests('get', '/api/blogs')
        .then((data) =>
          setBlogs(data.sort((a, b) => new Date(b.date) - new Date(a.date))),
        )
    }
  }, [blogs])

  useEffect(() => {
    if (blogs) {
      let updatedBlogs = []
      blogs.forEach((el) => {
        api
          .requests('get', `/api/user/finduser/${el.discord_id}`)
          .then((data) => {
            el.username = data.username
            el.avatar = data.avatar
            updatedBlogs.push(el)
          })
        setBlogs(updatedBlogs)
      })
    }
  }, [blogs])

  return (
    <div>
      {hasCerts && (
        <Button onClick={() => navigate('/blogs/createblog')}>
          create blog
        </Button>
      )}
      {blogs &&
        blogs.map((el, index) => {
          let backgroundTheme = getBlogColor(el.tags)
          let image = getImage(el.tags)

          return (
            <Box
              key={el.id}
              ref={containerRef}
              sx={{
                m: 1,
                ml: 5,
                mr: 5,
              }}
            >
              <List
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <ListItem
                  disablePadding
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  sx={{
                    backgroundColor:
                      theme.palette[backgroundTheme] &&
                      theme.palette[backgroundTheme].main
                        ? theme.palette[backgroundTheme].main
                        : theme.palette.default,
                    maxHeight: '112px',
                    maxWidth: '1776px',
                    overflow: 'hidden',
                    transform: 'skew(-25deg, 0deg)',
                  }}
                >
                  <ListItemButton
                    centerRipple={true}
                    onClick={() => {
                      navigate(`/blog/${el.id}`, {
                        state: el.post,
                      })
                    }}
                  >
                    <Grid
                      container
                      direction='row'
                      spacing={2}
                      sx={{
                        m: 1,
                        transform: 'skew(25deg, 0deg)',
                      }}
                    >
                      <Grid
                        item
                        lg={2}
                        sx={{ alignItems: 'center', display: 'flex' }}
                      >
                        <Avatar
                          src={`https://cdn.discordapp.com/avatars/${el.discord_id}/${el.avatar}.png`}
                        />
                        <Typography sx={{ pl: 2 }} variant='overline'>
                          Created by {el.username}
                          <DateTime data={el.date} display='block' />
                        </Typography>
                      </Grid>
                      <Grid item lg={8} sx={{ alignItems: 'center' }}>
                        <Typography sx={{ textAlign: 'center' }} variant='h4'>
                          {el.title}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        lg={2}
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Box
                          height={checkedStates[index] ? '95px' : '0'}
                          sx={{
                            bottom: 20,
                            display: 'flex',
                            justifyContent: 'center',
                            left: 600,
                            position: 'absolute',
                            zIndex: -1,
                          }}
                          // transition='all 0.3s ease'
                          width={checkedStates[index] ? '1744px' : '0'}
                        >
                          <Slide
                            container={containerRef.current}
                            direction='left'
                            in={checkedStates[index]}
                          >
                            <img
                              src={image}
                              style={{
                                aspectRatio: 'auto',
                                height: '160%',
                                objectFit: 'contain',
                              }}
                            />
                          </Slide>
                        </Box>
                        {el.tags &&
                          el.tags.map((el) => {
                            return (
                              <Chip
                                key={el}
                                label={el}
                                sx={{
                                  backgroundColor: '#2b2b2b',
                                  m: 0.5,
                                  mb: 2,
                                  zIndex: 10,
                                }}
                                variant='filled'
                              />
                            )
                          })}
                      </Grid>
                    </Grid>
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          )
        })}
    </div>
  )
}
