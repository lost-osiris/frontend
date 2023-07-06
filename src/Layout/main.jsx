import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import {
  CssBaseline,
  Toolbar,
  Typography,
  Alert,
  AlertTitle,
  Box,
} from '@mui/material'
import Header from './Header'
import Sidenav from './SideNav'
import { UserContext } from '~/context'
import AlertNotification from '~/components/Alert'

const Layout = () => {
  const alerts = useSelector((state) => state.value)
  const userInfo = useContext(UserContext)

  const alertsList = alerts.map((value, index) => (
    <AlertNotification key={`alert-${index}`} value={value} />
  ))

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      <Sidenav />
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        {alertsList}
        <Toolbar />
        {userInfo && <Outlet />}
        {!userInfo && (
          <Alert severity='warning' variant='outlined'>
            <AlertTitle>Please login with Discord!</AlertTitle>
            <Typography variant='body'>
              We require all users to login in with Discord before interacting
              with ModForge.
            </Typography>
          </Alert>
        )}
      </Box>
    </Box>
  )
}

export default Layout
