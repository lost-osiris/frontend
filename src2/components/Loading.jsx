import React from 'react'
import { CircularProgress } from '@mui/material'

const Loading = () => {
  return (
    <div
      style={{
        left: '55%',
        position: 'absolute',
        top: '52%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CircularProgress />
    </div>
  )
}

export default Loading
