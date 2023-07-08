import React from 'react'

import { Grid, Typography } from '@mui/material'

const ModLogs = ({ issue }) => {
  return (
    <>
      <Grid container justifyContent='center'>
        <Grid item>
          <Typography
            sx={{ fontStyle: 'italic', textAlign: 'center' }}
            variant='h6'
          >
            {issue.modlogs.title}
          </Typography>
        </Grid>
      </Grid>
      <pre>{issue.modlogs.body}</pre>
    </>
  )
}

export default ModLogs
