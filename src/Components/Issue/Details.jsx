import React from 'react'

import { Grid, Typography, Box, Avatar, Divider } from '@mui/material'

import { getStatusColorHk, toTitleCase } from '~/utils'
import TypeIcon from './TypeIcon'
import PriorityIcon from './PriorityIcon'

const Details = ({ issue }) => {
  return (
    <Grid container>
      <Grid item>
        <Grid item lg={12} sx={{ mt: 3 }}>
          <Box component='span'>
            <Grid container direction='row' justifyContent='left' spacing={1}>
              <Grid item>
                <Typography variant='overline'>Status:</Typography>
              </Grid>
              <Grid item>
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
            </Grid>
          </Box>
        </Grid>
        <Grid item lg={12} sx={{ mt: 3 }}>
          <Box component='span'>
            <Grid container direction='row' justifyContent='left' spacing={1}>
              <Grid item>
                <Typography variant='overline'>Type:</Typography>
              </Grid>
              <Grid item>
                <TypeIcon
                  sx={{
                    fontSize: '3rem',
                    ml: issue.type === 'bug' ? 6.5 : 7.5,
                    mt: -1.5,
                  }}
                  type={issue.type}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item lg={12} sx={{ mt: 2 }}>
          <Box component='span'>
            <Grid container direction='row' justifyContent='left' spacing={1}>
              <Grid item>
                <Typography variant='overline'>Priority:</Typography>
              </Grid>
              <Grid item>
                <PriorityIcon
                  sx={{
                    fontSize: '3rem',
                    ml: 3,
                    mt: -1.5,
                  }}
                  type={issue.priority}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item lg={12} sx={{ mt: 2 }}>
          <Box component='span'>
            <Grid container direction='row' justifyContent='left' spacing={1}>
              <Grid item>
                <Typography variant='overline'>Category:</Typography>
              </Grid>
              <Grid item sx={{ mt: 0.5 }}>
                <Typography sx={{ ml: 1.5 }} variant='body'>
                  {toTitleCase(issue.category)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item lg={12} sx={{ mt: 3 }}>
          <Box component='span'>
            <Grid container direction='row' justifyContent='left' spacing={1}>
              <Grid item>
                <Typography variant='overline'>Version:</Typography>
              </Grid>
              <Grid item sx={{ mt: 0.5 }}>
                <Typography sx={{ ml: 3 }} variant='body'>
                  {issue.version}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item lg={12}>
            <Box component='span'>
              <Grid container direction='row' justifyContent='left' spacing={1}>
                <Grid item>
                  <Typography variant='overline'>Author:</Typography>
                </Grid>
                <Grid item>
                  <Avatar
                    src={`https://cdn.discordapp.com/avatars/${issue.discord_id}/${issue.playerData.avatar}.png`}
                    sx={{
                      ml: 4.5,
                      mt: -0.7,
                      // cursor: "pointer",
                      // ":hover": {
                      //   boxShadow:
                      //     "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0.12)",
                      // },
                    }}
                    // onClick={() => navigate(`/user/${issue.discord_id}`)}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Divider flexItem orientation='vertical' sx={{ mr: '-1px', pl: 3 }} />
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
