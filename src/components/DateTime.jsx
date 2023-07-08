import React from 'react'
import { formatDateTimeString } from '../utils'

import { Typography } from '@mui/material'

const DateTime = (props) => {
  const { data, isUpdate, ...rest } = props
  return (
    <Typography variant='overline' {...rest}>
      {formatDateTimeString(data)}
    </Typography>
  )
}

export default DateTime
