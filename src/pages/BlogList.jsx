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
  const [blogs, setBlog] = useState()
  const [checkedStates, setCheckedStates] = useState(
    blogs ? new Array(blogs.length).fill(false) : [],
  )
  const containerRef = useRef(null)

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
      api.requests('get', '/api/blogs').then((data) => setBlog(data))
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
          let backgroundTheme = getBlogColor(el.blog_info.tags)
          let image = getImage(el.blog_info.tags)

          return (
            <Box
              key={el.blog_info.id}
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
                    overflow: 'hidden',
                    transform: 'skew(-25deg, 0deg)',
                  }}
                >
                  <ListItemButton centerRipple={true}>
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
                          src={`https://cdn.discordapp.com/avatars/${el.user_info.discord_id}/${el.user_info.avatar}.png`}
                        />
                        <Typography sx={{ pl: 2 }} variant='overline'>
                          Created by {el.user_info.username}
                          <DateTime data={el.blog_info.date} display='block' />
                        </Typography>
                      </Grid>
                      <Grid item lg={8} sx={{ alignItems: 'center' }}>
                        <Typography sx={{ textAlign: 'center' }} variant='h4'>
                          {el.blog_info.title}
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
                        {el.blog_info.tags &&
                          el.blog_info.tags.map((el) => {
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
