import React, { useState, useEffect } from 'react'
import { Box, LinearProgress } from '@mui/material'

export const ProgressBar = ({ count }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const completedCount = count.filter((obj) => obj.completed).length

    const totalObjects = count.length
    const percentageCompleted =
      totalObjects === 0 ? 0 : (completedCount / totalObjects) * 100
    setProgress(percentageCompleted)
  }, [count])

  const color = (progress) => (progress === 100 ? 'success' : 'primary')

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress
        color={color(progress)}
        value={progress}
        variant='determinate'
      />
    </Box>
  )
}
