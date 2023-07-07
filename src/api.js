import axios from 'axios'
import { dispatchAlert } from './store'
import { parseJwt } from './utils'

export const requests = async (method, url, options) => {
  if (!options) {
    options = {}
  }

  if (!options.headers) {
    options.headers = {}
  }

  if (!options.data) {
    options.data = {}
  }

  let jwt = localStorage.getItem('jwt')

  if (!jwt) {
    window.location = '/'
  }

  if (Date.now() >= parseJwt(jwt).exp * 1000) {
    dispatchAlert({
      duration: 5000,
      message: 'Session expired! Automatically redirecting in 5 seconds',
      type: 'error',
    })
    localStorage.removeItem('jwt')
    setTimeout(() => {
      window.location = '/'
    }, 5000)
  } else {
    return axios({
      data: options.data,
      headers: {
        // TODO add authorization header
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      method: method,
      url: url,
    })
      .then((res) => {
        if (res.status >= 200 && options.alert) {
          dispatchAlert({
            message: options.alertMessage || 'Success',
            type: 'success',
          })
        }

        return res.data
      })
      .catch((error) => {
        if (error.response.status === 403) {
          dispatchAlert({
            message: 'Forbidden',
            type: 'error',
          })
        }
      })
  }
}
