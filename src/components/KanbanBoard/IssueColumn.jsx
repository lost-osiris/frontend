import React, { useContext } from 'react'
import { useDrop } from 'react-dnd'
import { KanbanBoardContext } from '~/context'
import { IssueCard } from '~/components/KanbanBoard/IssueCard'
import { toTitleCase, getStatusColorHk } from '~/utils'
import { Typography, Grid, Divider } from '@mui/material'

export const IssueListColumn = ({ name }) => {
  const { issues, updateIssue, deleteIssue } = useContext(KanbanBoardContext)
  const filteredIssues = issues.filter((issue) => issue.status === name)

  let [{ canDrop }, drop] = useDrop({
    accept: 'issue',
    collect: (monitor) => {
      let item = monitor.getItem()
      let issue = item ? item.issue : {}
      let accept = issue.status !== name

      return {
        canDrop: monitor.canDrop() && accept,
        isOver: monitor.isOver(),
      }
    },
    drop: (item) => {
      if (name !== item.issue.status) {
        updateIssue({ ...item.issue, date: new Date(), status: name })
      }
    },
  })

  return (
    <>
      <Grid container>
        <Grid item lg={12}>
          <Typography
            sx={{
              bgcolor: getStatusColorHk(name),
              borderColor: getStatusColorHk(name),
              borderRadius: '5px',
              opacity: 0.9,
            }}
            textAlign='center'
            variant='h4'
          >
            {name
              .split(' ')
              .map((s) => toTitleCase(s))
              .join(' ')}
          </Typography>
          <Divider
            sx={{
              mb: 1,
              mt: 1,
            }}
          />
        </Grid>
      </Grid>
      <Grid container sx={{ height: 'calc(100% - 60px)' }}>
        <Grid
          item
          lg={12}
          ref={drop}
          sx={{
            borderColor: canDrop ? getStatusColorHk(name) : '',
            borderRadius: canDrop ? '10px' : '',
            borderStyle: canDrop ? 'dotted' : '',
          }}
        >
          {filteredIssues
            .filter((value) => !value.archived)
            .map((el) => {
              return (
                <IssueCard
                  issue={el}
                  key={`${el.id}-issue-card`}
                  onDelete={() => deleteIssue(el)}
                  sx={{
                    mb: 1,
                    ml: 1,
                    mr: 1,
                    mt: 1,
                  }}
                />
              )
            })}
        </Grid>
      </Grid>
    </>
  )
}
