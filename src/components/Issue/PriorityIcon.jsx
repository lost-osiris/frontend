import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import { Box } from '@mui/material'

const PriorityIcon = (props) => {
  let { type, sx, size, ...rest } = props
  size = size || 'lg'
  sx = sx || {}

  if (type === 'low') {
    return (
      <Box sx={{ ...sx, color: 'info.main' }} {...rest}>
        <FontAwesomeIcon
          icon={icon({ name: 'chevrons-down', style: 'duotone' })}
          size={size}
        />
      </Box>
    )
  } else if (type === undefined || type === null || type === 'medium') {
    // return <DragHandleIcon color='warning' sx={sx} {...rest} />
    return (
      <Box sx={{ ...sx, color: 'warning.main' }} {...rest}>
        <FontAwesomeIcon
          icon={icon({ name: 'equals', style: 'duotone' })}
          size={size}
        />
      </Box>
    )
  } else if (type === 'high') {
    return (
      <Box sx={{ ...sx, color: 'error.main' }} {...rest}>
        <FontAwesomeIcon
          icon={icon({ name: 'chevrons-up', style: 'duotone' })}
          size={size}
        />
      </Box>
    )
  }
}

export default PriorityIcon
