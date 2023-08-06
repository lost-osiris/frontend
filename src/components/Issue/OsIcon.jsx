import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import { Stack, Typography } from '@mui/material'

const OsIcon = (props) => {
  let { os, showNa } = { ...props }
  showNa = showNa || false

  return (
    <Stack direction='row' spacing={2}>
      {(!os || os.length === 0) && showNa ? (
        <Typography variant='body'>N/A</Typography>
      ) : (
        <></>
      )}
      {os && os.indexOf('windows') > -1 && (
        <FontAwesomeIcon
          icon={icon({ name: 'windows', style: 'brands' })}
          size='lg'
        />
      )}
      {os && os.indexOf('macOS') > -1 && (
        <FontAwesomeIcon
          icon={icon({ name: 'apple', style: 'brands' })}
          size='lg'
        />
      )}
      {os && os.indexOf('linux') > -1 && (
        <FontAwesomeIcon
          icon={icon({ name: 'linux', style: 'brands' })}
          size='lg'
        />
      )}
      {os && os.indexOf('handheld') > -1 && (
        <FontAwesomeIcon
          icon={icon({ name: 'game-console-handheld' })}
          size='lg'
        />
      )}
    </Stack>
  )
}

export default OsIcon
