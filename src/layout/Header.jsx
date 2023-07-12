import React, { useState, useContext } from 'react'
import { UserContext } from '~/context'

import { useNavigate, useParams } from 'react-router-dom'

import {
  Avatar,
  AppBar,
  Typography,
  Toolbar,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
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
    window.location = '/project/63fe47296edfc3b387628861/issues/general'
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

        <div>
          {!userInfo && (
            <Fab color='discord' href={AUTH_REDIRECT_URL} variant='extended'>
              Discord Login
              <LoginIcon sx={{ pl: 0.5 }} />
            </Fab>
          )}
        </div>

        {userInfo && project && (
          <Fab
            onClick={() =>
              navigate(
                `/project/63fe47296edfc3b387628861/create-issue/${params.category}`,
              )
            }
            sx={{ margin: 1 }}
            variant='extended'
          >
            Issue
            <AddIcon sx={{ pl: 0.5 }} />
          </Fab>
        )}

        {userInfo && (
          <>
            <Fab
              onClick={() =>
                window.open(
                  'https://www.paypal.com/donate/?hosted_button_id=YWNUFXPDDYNSL',
                  '_blank',
                )
              }
              sx={{
                //   mt: 19,
                backgroundColor: 'gold',
                margin: 1,
              }}
              variant='extended'
            >
              Donate
              <MoneyIcon sx={{ pl: 0.5 }} />
            </Fab>
            <Fab
              color='discord'
              // onClick={() => navigate(`/user/${userInfo.data.discord_id}`)}
              onClick={handleClick}
              variant='circular'
            >
              <Avatar
                alt={userInfo.user.username}
                src={`https://cdn.discordapp.com/avatars/${userInfo.user.discord_id}/${userInfo.user.avatar}.png`}
                sx={{ height: 50, width: 50 }}
              />
            </Fab>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <MenuItem onClick={handleClose}>
                <Avatar
                  alt={userInfo.username}
                  onClick={handleClick}
                  src={`https://cdn.discordapp.com/avatars/${userInfo.user.discord_id}/${userInfo.user.avatar}.png`}
                  sx={{ height: 50, width: 50 }}
                />{' '}
                Profile
              </MenuItem>
              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <Logout fontSize='small' />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
