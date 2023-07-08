import React from 'react'

import { Typography } from '@mui/material'

function numSuffixOf(i) {
  var j = i % 10,
    k = i % 100
  if (j == 1 && k != 11) {
    return 'st'
  }
  if (j == 2 && k != 12) {
    return 'nd'
  }
  if (j == 3 && k != 13) {
    return 'rd'
  }
  return 'th'
}

const DAYS = ['Mon', 'Tues', 'Thurs', 'Fri', 'Sat', 'Sun']
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const DateTime = (props) => {
  const { data, isUpdate, ...rest } = props

  let datetime = new Date(data + 'Z')

  let hour = datetime.getHours()
  let minute = datetime.getMinutes()
  let day = datetime.getDay()
  let month = datetime.getMonth()
  let date = datetime.getDate()

  let timeStr = `${hour - 12}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`
  let dateStr = `${DAYS[day]}, ${MONTHS[month]} ${date}${numSuffixOf(date)}`

  return (
    <Typography {...rest}>
      {dateStr} at {timeStr}
    </Typography>
  )
}

export default DateTime
