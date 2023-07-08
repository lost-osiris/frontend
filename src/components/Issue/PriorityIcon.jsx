import React from 'react'

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import DragHandleIcon from '@mui/icons-material/DragHandle'

const PriorityIcon = (props) => {
  let { type, sx, ...rest } = props
  sx = sx || {}

  if (type === 'low') {
    return (
      <DoubleArrowIcon
        color='info'
        sx={{ transform: 'rotate(90deg)', ...sx }}
        {...rest}
      />
    )
  } else if (type === undefined || type === null || type === 'medium') {
    return <DragHandleIcon color='warning' sx={sx} {...rest} />
  } else if (type === 'high') {
    return (
      <DoubleArrowIcon
        color='error'
        sx={{
          transform: 'rotate(-90deg)',
          ...sx,
        }}
        {...rest}
      />
    )
  }
}

export default PriorityIcon
