import React from 'react'

import { Grid, Typography, Avatar, Divider } from '@mui/material'

import { getStatusColorHk, toTitleCase } from '~/utils'
import TypeIcon from './TypeIcon'
import PriorityIcon from './PriorityIcon'
import OsIcon from './OsIcon'

const Details = ({ issue }) => {
  return (
    <Grid container>
      <Grid item lg={2}>
        <Grid container direction='row'>
          <Grid item lg={3}>
            <Grid
              alignItems='flex-end'
              container
              direction='column'
              spacing={3}
            >
              <Grid item lg={12}>
                <Typography variant='overline'>Status:</Typography>
              </Grid>
              <Grid item lg={12}>
                <Typography variant='overline'>Type:</Typography>
              </Grid>
              <Grid item lg={12}>
                <Typography variant='overline'>Priority:</Typography>
              </Grid>
              <Grid item lg={12}>
                <Typography variant='overline'>Category:</Typography>
              </Grid>
              <Grid item lg={12}>
                <Typography variant='overline'>Version:</Typography>
              </Grid>
              <Grid item lg={12}>
                <Typography variant='overline'>Author:</Typography>
              </Grid>
              <Grid item lg={12}>
                <Typography variant='overline'>OS:</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={9}>
            <Grid alignItems='center' container direction='column' spacing={3}>
              <Grid item lg={12}>
                <Typography
                  sx={{
                    bgcolor: getStatusColorHk(
                      issue.archived ? 'archived' : issue.status,
                    ),
                    borderColor: getStatusColorHk(
                      issue.archived ? 'archived' : issue.status,
                    ),
                    borderRadius: '5px',
                    ml: 2,
                    mr: 2,
                    opacity: 0.9,
                    pl: 2,
                    pr: 2,
                  }}
                  textAlign='center'
                  variant='h6'
                >
                  {issue.archived
                    ? 'Archived'
                    : issue.status
                        .split(' ')
                        .map((s) => toTitleCase(s))
                        .join(' ')}
                </Typography>
              </Grid>
              <Grid item lg={12}>
                <TypeIcon size='2xl' type={issue.type} />
              </Grid>
              <Grid item lg={12}>
                <PriorityIcon size='2xl' type={issue.priority} />
              </Grid>
              <Grid item lg={12} sx={{ mt: 0.5 }}>
                <Typography variant='body'>
                  {toTitleCase(issue.category)}
                </Typography>
              </Grid>
              <Grid item lg={12} sx={{ mt: 1 }}>
                <Typography variant='body'>{issue.version}</Typography>
              </Grid>
              <Grid item lg={12}>
                <Avatar
                  src={`https://cdn.discordapp.com/avatars/${issue.discord_id}/${issue.playerData.avatar}.png`}
                  sx={
                    {
                      // cursor: "pointer",
                      // ":hover": {
                      //   boxShadow:
                      //     "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0.12)",
                      // },
                    }
                  }
                  // onClick={() => navigate(`/user/${issue.discord_id}`)}
                />
              </Grid>
              <Grid item lg={12}>
                <OsIcon os={issue.os} showNa={true} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider flexItem orientation='vertical' sx={{ mr: '-1px' }} />
      <Grid item lg={10} sx={{ pl: 5 }}>
        <div
          dangerouslySetInnerHTML={{
            __html: issue.description,
          }}
        />
      </Grid>
    </Grid>
  )
}

export default Details
