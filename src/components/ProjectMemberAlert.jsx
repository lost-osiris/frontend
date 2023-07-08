import React from 'react'
import { Grid, Alert, AlertTitle, IconButton, Typography } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useNavigate } from 'react-router-dom'
import { AUTH_REDIRECT_URL } from '~/constants'

const ProjectMemberAlert = () => {
  const navigate = useNavigate()
  return (
    <div>
      <Alert severity='warning'>
        <AlertTitle>Not a project Member</AlertTitle>
        <Typography variant='body'>
          You are not a member of the project and cannot see this issues
          associated with it — Please navigate{' '}
          <Typography
            component='span'
            onClick={() =>
              navigate('/project/63fe47296edfc3b387628861/joinwaitlist')
            }
            sx={{
              ':hover': { cursor: 'pointer', textDecoration: 'underline' },
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            HERE
          </Typography>{' '}
          to request access to the project
          <br></br>
        </Typography>
        <Grid container>
          <Grid item>
            <Typography sx={{ textDecoration: 'bold' }} variant='body'>
              If you believe you already have access to the project, please try
              reauthenticating!
              <IconButton
                color='primary'
                onClick={() => {
                  localStorage.removeItem('jwt')
                  window.location = AUTH_REDIRECT_URL
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Typography>
          </Grid>
        </Grid>
      </Alert>
    </div>
  )
}

export default ProjectMemberAlert
