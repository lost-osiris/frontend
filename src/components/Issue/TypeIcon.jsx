import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import { Box } from '@mui/material'

const TypeIcon = (props) => {
  let { chip, type, sx, size, ...rest } = props
  size = size || 'lg'

  sx = sx || {}
  if (type === null || type === undefined || type === 'bug') {
    return (
      <Box sx={{ ...sx, color: 'warning.main' }} {...rest}>
        <FontAwesomeIcon
          icon={icon({ name: 'bug', style: 'duotone' })}
          size={size}
        />
      </Box>
    )
  }

  if (type === 'suggestion') {
    return (
      <Box sx={sx} {...rest}>
        <FontAwesomeIcon
          icon={icon({ name: 'lightbulb-on', style: 'duotone' })}
          size={size}
        />
      </Box>
    )
  }
}

export default TypeIcon
