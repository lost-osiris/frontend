import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { UserContext, ProjectsContext } from '~/context'
import * as api from '~/api'

import {
  Grid,
  Typography,
  Avatar,
  Divider,
  Checkbox,
  FormControlLabel,
} from '@mui/material'

const Assignments = ({ issue, setProgress, fetchIssue }) => {
  if (issue.assignments) {
    const { user } = useContext(UserContext)
    const { project } = useContext(ProjectsContext)
    let params = useParams()

    const checkHandler = (assignment) => {
      if (assignment.user.discord_id !== user.discord_id) {
        for (let member of project.members) {
          if (member.discord_id === user.discord_id) {
            if (member.role === 'maintainer') {
              return false
            } else {
              return true
            }
          }
        }
      } else {
        return false
      }
    }

    const handleChange = (index) => {
      const updatedAssignments = [...issue.assignments]
      updatedAssignments[index] = {
        ...updatedAssignments[index],
        completed: !updatedAssignments[index].completed,
      }

      api
        .requests(
          'put',
          `/api/project/${params.projectId}/issue/${params.issueId}/updateassignments`,
          {
            alert: true,
            alertMessage: 'Successfully updated your assignment',
            data: {
              assignments: updatedAssignments,
              issueId: issue.id,
            },
          },
        )
        .then(() => {
          const completedCount = updatedAssignments.filter(
            (obj) => obj.completed,
          ).length
          const totalObjects = updatedAssignments.length
          const percentageCompleted =
            totalObjects === 0 ? 0 : (completedCount / totalObjects) * 100

          setProgress(percentageCompleted)
          fetchIssue()
        })
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
                      checked={assignment.completed}
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
}

export default Assignments
