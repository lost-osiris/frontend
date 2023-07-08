import React, { useEffect, useState } from 'react'
import * as api from '~/api'

export const ManageWaitlist = () => {
  const [waitlist, setWaitlist] = useState()

  const addToProject = (memberWithRole) => {
    api.requests(
      'put',
      '/api/project/63fe47296edfc3b387628861/members/updatewaitlist',
      {
        alert: true,
        alertMessage: 'Successfully approved waitlist',
        data: memberWithRole,
      },
    )
  }

  useEffect(() => {
    if (!waitlist) {
      api
        .requests('get', '/api/project/63fe47296edfc3b387628861/waitlist')
        .then((data) => setWaitlist(data.waitlist))
    }
  }, [waitlist])

  return (
    <div>
      {waitlist !== undefined && (
        <ul>
          {waitlist.map((member) => (
            <li key={member.discord_id}>
              {member.username}
              <button
                onClick={() =>
                  addToProject({
                    member,
                    role: 'contributor',
                  })
                }
              >
                add as contributor
              </button>
              <button
                onClick={() =>
                  addToProject({
                    member,
                    role: 'maintainer',
                  })
                }
              >
                add as maintainer
              </button>
              <button
                onClick={() =>
                  addToProject({
                    member,
                    role: 'remove',
                  })
                }
              >
                delete from waitlist
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
