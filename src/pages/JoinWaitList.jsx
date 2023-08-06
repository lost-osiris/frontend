import React, { useContext } from 'react'
import { UserContext } from '~/context'
import { Grid, Alert, AlertTitle, IconButton } from '@mui/material/'
import { useParams } from 'react-router-dom'
import * as api from '~/api'

import RefreshIcon from '@mui/icons-material/Refresh'

export const JoinWaitlist = () => {
  const userInfo = useContext(UserContext)
  const params = useParams()
  const joinList = (e) => {
    e.preventDefault()
    api.requests(
      'post',
      `/api/project/${params.projectId}/members/joinwaitlist`,
      {
        alert: true,
        alertMessage: 'Successfully requested to join waitlist',
        data: userInfo.data,
      },
    )
  }
  return (
    <div>
      <Alert severity='info'>
        <AlertTitle>Request Project Access</AlertTitle>
        If you wish to contribute to the project, you will have to join the
        waitlist, upon requesting access, an admin will have to verify your
        entry —{' '}
        <strong>
          Please click{' '}
          <a href='/' onClick={(e) => joinList(e)}>
            here{' '}
          </a>
          to join the waitlist
        </strong>
        <br></br>
        <Grid container>
          <h3>
            If you believe you already have access to the project, try
            navigating home
          </h3>

          <IconButton
            color='primary'
            onClick={() => (window.location.href = '/')}
          >
            <RefreshIcon />
          </IconButton>
        </Grid>
      </Alert>
    </div>
  )
}
