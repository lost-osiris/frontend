import React, { useState, useContext } from 'react'
import { UserContext } from '~/context'
import theme from '~/theme'

import { useNavigate, useParams } from 'react-router-dom'

import {
  Avatar,
  AppBar,
  Grid,
  Typography,
  Toolbar,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItem,
  ListItemText,
  List,
  ListItemButton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import LoginIcon from '@mui/icons-material/Login'
import HomeIcon from '@mui/icons-material/Home'
import Logout from '@mui/icons-material/Logout'
import MoneyIcon from '@mui/icons-material/AttachMoney'
import { AUTH_REDIRECT_URL } from '~/constants'
import { ProjectsContext } from '../context'

const Header = () => {
  const userInfo = useContext(UserContext)
  const { project } = useContext(ProjectsContext)

  const navigate = useNavigate()
  const params = useParams()
  const [anchorEl, setAnchorEl] = useState()
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const logout = () => {
    localStorage.removeItem('jwt')
    window.location = '/'
  }
  return (
    <AppBar
      position='fixed'
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Fab onClick={() => (window.location.href = '/')} size='small'>
          <HomeIcon />
        </Fab>
        <Typography component='div' sx={{ flexGrow: 1, pl: 1 }} variant='h6'>
          ModForge
        </Typography>

        <Grid alignItems='center' container justifyContent='flex-end'>
          {!userInfo && (
            <Grid item>
              <List
                component='div'
                disablePadding
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <ListItem
                  disablePadding
                  sx={{
                    boxShadow: '0 0 20px rgba(0,0,0,0.75)',
                    clipPath: 'inset(0px -15px 0px 0px)',
                    height: '100%', // Set height to 100% to ensure child elements take up full height
                    transform: 'skew(-25deg, 0deg)',
                  }}
                >
                  <ListItemButton
                    href={AUTH_REDIRECT_URL}
                    sx={{
                      alignItems: 'center', // Align the button content vertically
                      backgroundColor: theme.palette.discord.main,
                      display: 'flex',
                      height: '100%',
                      justifyContent: 'center', // Align the button content horizontally
                    }}
                  >
                    <ListItemText
                      primary='Discord Login'
                      primaryTypographyProps={{
                        color: 'white',
                        fontWeight: 'bold',
                        variant: 'h6',
                      }}
                      sx={{ transform: 'skew(25deg, 0deg)' }}
                    />
                    <ListItemIcon sx={{ color: 'white' }}>
                      <LoginIcon sx={{ pl: 0.5 }} />
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              </List>
            </Grid>
          )}

          {userInfo && project && (
            <Grid item>
              <List
                component='div'
                disablePadding
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <ListItem disablePadding sx={{ height: '100%' }}>
                  <ListItemButton
                    onClick={() =>
                      navigate(
                        `/project/${params.projectId}/create-issue/${
                          params.category || 'general'
                        } `,
                      )
                    }
                    sx={{ height: '100%', transform: 'skew(-25deg, 0deg)' }}
                  >
                    <ListItemText
                      primary='Issue'
                      primaryTypographyProps={{
                        color: 'white',
                        fontWeight: 'bold',
                        variant: 'h6',
                      }}
                      sx={{
                        alignItems: 'center', // Align the button content vertically
                        display: 'flex',
                        height: '100%', // Ensure the button takes full height
                        transform: 'skew(25deg, 0deg)',
                      }}
                    />
                    <ListItemIcon
                      sx={{
                        marginRight: '0.5rem',
                        transform: 'skew(25deg, 0deg)',
                      }}
                    >
                      <AddIcon />
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              </List>
            </Grid>
          )}

          {userInfo && (
            <Grid item>
              <List
                component='div'
                disablePadding
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <ListItem
                  disablePadding
                  sx={{
                    backgroundColor: 'rgba(255, 215, 0, 0.25)',
                    transform: 'skew(-25deg, 0deg)',
                  }}
                >
                  <ListItemButton
                    onClick={() =>
                      window.open(
                        'https://www.paypal.com/donate/?hosted_button_id=YWNUFXPDDYNSL',
                        '_blank',
                      )
                    }
                    sx={{
                      alignItems: 'center', // Align the button content vertically
                      display: 'flex',
                      height: '100%',
                      justifyContent: 'center', // Align the button content horizontally
                    }}
                  >
                    <ListItemText
                      primary='Donate'
                      primaryTypographyProps={{
                        color: 'white',
                        fontWeight: 'bold',
                        variant: 'h6',
                      }}
                      sx={{ transform: 'skew(25deg, 0deg)' }}
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  sx={{ height: '100%', transform: 'skew(-25deg, 0deg)' }}
                >
                  <ListItemButton>
                    <Fab
                      color='discord'
                      onClick={handleClick}
                      sx={{ height: '100%', transform: 'skew(25deg, 0deg)' }}
                      variant='circular'
                    >
                      <Avatar
                        alt={userInfo.user.username}
                        src={`https://cdn.discordapp.com/avatars/${userInfo.user.discord_id}/${userInfo.user.avatar}.png`}
                        sx={{ height: '100%', width: '100%' }} // Make the avatar take full height and width
                      />
                    </Fab>
                    <Menu
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        horizontal: 'right',
                        vertical: 'bottom',
                      }}
                      id='account-menu'
                      onClick={handleClose}
                      onClose={handleClose}
                      open={open}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          '& .MuiAvatar-root': {
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                            width: 32,
                          },
                          '&:before': {
                            bgcolor: 'background.paper',
                            content: '""',
                            display: 'block',
                            height: 10,
                            position: 'absolute',
                            right: 23,
                            top: 0,
                            transform: 'translateY(-50%) rotate(45deg)',
                            width: 10,
                            zIndex: 0,
                          },
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                          height: 50,
                          mt: 1.5,
                          overflow: 'visible',
                          width: 250,
                        },
                      }}
                      transformOrigin={{
                        horizontal: 'right',
                        vertical: 'top',
                      }}
                    >
                      <MenuItem
                        onClick={() =>
                          navigate(`/user/${userInfo.user.discord_id}`)
                        }
                      >
                        <Avatar
                          alt={userInfo.username}
                          src={`https://cdn.discordapp.com/avatars/${userInfo.user.discord_id}/${userInfo.user.avatar}.png`}
                          sx={{ height: 50, width: 50 }}
                        />
                        Profile
                      </MenuItem>
                      <MenuItem onClick={logout}>
                        <ListItemIcon>
                          <Logout fontSize='small' />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </ListItemButton>
                </ListItem>
              </List>
            </Grid>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default Header
