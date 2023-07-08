import React, { useState } from 'react'
import { Grow, Snackbar, Alert } from '@mui/material'

function TransitionLeft(props) {
  return <Grow {...props} direction='left' />
}

export default function AlertNotification({ value }) {
  const [open, setOpen] = useState(true)

  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      autoHideDuration={value.duration || 5000}
      disableWindowBlurListener={true}
      onClose={() => setOpen(false)}
      open={open}
      sx={{ mt: 7, width: 500 }}
      TransitionComponent={TransitionLeft}
    >
      <Alert
        severity={value.type}
        sx={{
          backgroundColor: 'background.default',
          width: '100%',
        }}
        variant='outlined'
      >
        {value.message}
      </Alert>
    </Snackbar>
  )
}
