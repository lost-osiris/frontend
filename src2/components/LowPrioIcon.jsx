import React from 'react'

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'

export const LowPriorityIcon = () => {
  return (
    <DoubleArrowIcon
      color='info'
      sx={{
        ml: 0.3,
        pl: 0,
        transform: 'rotate(90deg)',
      }}
    />
  )
}
