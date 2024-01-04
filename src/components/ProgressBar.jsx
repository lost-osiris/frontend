import React from 'react'
import { Box, LinearProgress } from '@mui/material'

export const ProgressBar = ({ progress }) => {
  const calculateColor = (progress) => {
    if (progress <= 25) {
      return 'error'
    } else if (progress <= 75) {
      return 'warning'
    } else if (progress < 100) {
      return 'primary'
    } else {
      return 'success'
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress
        color={calculateColor(progress)}
        value={progress}
        variant='determinate'
      />
    </Box>
  )
}
