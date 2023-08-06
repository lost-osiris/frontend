import React from 'react'

import { Box } from '@mui/material'

export const TabPanel = (props) => {
  const { children, value, index, ...other } = props
  return (
    <div hidden={value !== index} id={value} role='tabpanel' {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}
