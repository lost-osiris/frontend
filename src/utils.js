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
