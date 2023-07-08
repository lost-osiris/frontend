import React from 'react'

import { Grid, Typography, Box } from '@mui/material'

const IssueAttachments = ({ issue }) => {
  return (
    <>
      {!issue.attachments.embedSource & !issue.attachments.generalUrl ? (
        <Grid container justifyContent='center'>
          <Grid item>
            <Typography
              sx={{ fontStyle: 'italic', textAlign: 'center' }}
              variant='h6'
            >
              No Attachments Set
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <>
          <Grid container justifyContent='center'>
            <Grid item>
              <Box
                component='span'
                onClick={() =>
                  window.open(issue.attachments.generalUrl, '_blank')
                }
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    opacity: [0.9, 0.8, 0.7],
                    textDecoration: 'underline',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontStyle: 'italic',
                    textAlign: 'center',
                  }}
                  variant='h6'
                >
                  View Attachment URL
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
      <Grid container justifyContent='center' sx={{ mt: 2 }}>
        {issue.attachments.generalUrl && (
          <Grid item>
            <iframe
              src={`${issue.attachments.generalUrl}`}
              style={{
                height: '95vh',
                overflow: 'visible',
                width: '75vw',
              }}
              title='issue-attachment-general-url'
            />
          </Grid>
        )}
        {issue.attachments.embedSource && (
          <Grid item>
            <div
              dangerouslySetInnerHTML={{
                __html: issue.attachments.embedSource,
              }}
            ></div>
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default IssueAttachments
