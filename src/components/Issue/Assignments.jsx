import React, { useState, useContext } from 'react'
import { UserContext } from '~/context'

import {
  Grid,
  Typography,
  Avatar,
  Divider,
  Checkbox,
  FormControlLabel,
} from '@mui/material'

const Details = ({ issue }) => {
  const { user } = useContext(UserContext)
  const [checked, setChecked] = useState(
    issue.assignments.map((assignment) => assignment.completed),
  )

  const checkHandler = (assignment) => {
    return assignment.user.discord_id !== user.discord_id
  }

  const handleChange = (index) => {
    const updatedChecked = [...checked]
    updatedChecked[index] = !updatedChecked[index]
    setChecked(updatedChecked)
  }

  return (
    <Grid
      alignItems='center'
      container
      direction='row'
      justifyContent='space-evenly'
    >
      {issue.assignments.map((assignment, index) => (
        <Grid item key={index}>
          <Grid
            alignItems='center'
            container
            direction='column'
            justifyContent='flex-start'
          >
            <Grid item>
              <Avatar
                alt={assignment.user.username}
                src={`https://cdn.discordapp.com/avatars/${assignment.user.discord_id}/${assignment.user.avatar}.png`}
                sx={{ height: '100px', width: '100px' }}
              />
            </Grid>
            <Grid item>
              <Typography variant='h3'>{assignment.user.username}</Typography>
              <Divider />
            </Grid>
            <Grid alignContent={'center'} item>
              {assignment.task}
            </Grid>
            <Grid alignContent={'center'} item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked[index]}
                    onChange={() => handleChange(index)}
                  />
                }
                disabled={checkHandler(assignment)}
                label={'Task Complete'}
              />
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}

export default Details
