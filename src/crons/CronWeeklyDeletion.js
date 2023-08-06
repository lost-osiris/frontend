import * as api from '~/api'

const deleteOldIssues = () => {
  api.requests('delete', '/api/cron/delete-expired')
}

deleteOldIssues()
