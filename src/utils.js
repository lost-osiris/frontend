export const toTitleCase = (str) => {
  if (!str) {
    return str
  }

  return str.replace('-', ' ').replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'low':
      return 'primary'
    case 'medium':
      return 'warning'
    case 'high':
      return 'error'
    default:
      return 'default'
  }
}

export const getStatusColor = (status) => {
  switch (status) {
    case 'reported':
      return 'info'
    case 'in-progress':
      return 'warning'
    case 'completed':
      return 'success'
    case "won't-fix":
      return 'success'
    case 'closed':
      return 'success'
    case 'archive':
      return 'info'
    default:
      return 'default'
  }
}

export const getStatusColorHk = (status) => {
  switch (status) {
    case 'reported':
      return '#ea6e48'
    case 'in-progress':
      return '#eec96d'
    case 'completed':
      return '#aea5a3'
    case "won't-fix":
      return '#2e212d'
    case 'closed':
      return '#12152f'
    case 'archived':
      return '#42a5f5'
    default:
      return 'default'
  }
}

export const getTypeColor = (type) => {
  switch (type) {
    case 'bug':
      return 'warning'
    case 'suggestion':
      return 'primary'
    case 'feature-request':
      return 'secondary'
    default:
      return 'default'
  }
}

export const overflowLimiter = (text) => {
  if (text.length > 100) {
    text = text.substring(0, 100) + '...'
    return text
  }
}

export const parseJwt = (token) => {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join(''),
  )

  return JSON.parse(jsonPayload)
}

export const formatDateTimeString = (UTCTime) => {
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

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
  let now = new Date()
  let datetime = new Date(UTCTime + 'Z')

  let hour = datetime.getHours()
  let minute = datetime.getMinutes()
  let day = datetime.getDay()
  let month = datetime.getMonth()
  let date = datetime.getDate()

  let nowHour = now.getHours()
  let nowMinute = now.getMinutes()
  let nowDay = now.getDate()

  let timeStr = `${hour > 12 ? hour - 12 : hour}:${minute} ${
    hour >= 12 ? 'PM' : 'AM'
  }`
  let dateStr = `${DAYS[day]}, ${MONTHS[month]} ${date}${numSuffixOf(date)}`

  switch (true) {
    case nowDay === date && nowHour === hour:
      return nowMinute - minute === 0
        ? 'now'
        : nowMinute - minute === 1
        ? '1 minute ago'
        : `${nowMinute - minute} minutes ago`
    case nowDay === date:
      return nowHour - hour === 1 ? '1 hour ago' : `${nowHour - hour} hours ago`
    case nowDay - 1 === date:
      return `Yesterday at ${timeStr}`
    default:
      return `${dateStr} at ${timeStr}`
  }
}
