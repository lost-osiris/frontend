import React from 'react'

import { Chip } from '@mui/material'

export const CardChip = ({ label, color, img }) => {
  return (
    <Chip
      avatar={img}
      color={color}
      label={label}
      sx={{ pl: 1 }}
      variant='outlined'
    />
  )
}
