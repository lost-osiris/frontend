import React from 'react'

import BugReportIcon from '@mui/icons-material/BugReport'
import SuggectionIcon from '@mui/icons-material/TipsAndUpdates'

const TypeIcon = (props) => {
  const { chip, type, ...rest } = props

  if (type === null || type === undefined || type === 'bug') {
    return <BugReportIcon color='warning' {...rest} />
  }

  if (type === 'suggestion') {
    return <SuggectionIcon {...rest} />
  }
}

export default TypeIcon
