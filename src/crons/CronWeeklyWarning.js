import * as api from '~/api'

const warningForDeletion = () => {
  api.requests('get', '/api/cron/delete-warning')
}

warningForDeletion()
