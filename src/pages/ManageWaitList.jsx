import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as api from '~/api'

export const ManageWaitlist = () => {
  const [waitlist, setWaitlist] = useState()
  const params = useParams()

  const addToProject = (memberWithRole) => {
    api
      .requests(
        'put',
        `/api/project/${params.projectId}/members/updatewaitlist`,
        {
          alert: true,
          alertMessage: 'Successfully approved waitlist',
          data: memberWithRole,
        },
      )
      .then(() =>
        setWaitlist((waitlist) =>
          waitlist.filter((member) => member !== memberWithRole.member),
        ),
      )
  }

  useEffect(() => {
    if (!waitlist) {
      api
        .requests('get', `/api/project/${params.projectId}/waitlist`)
        .then((data) => setWaitlist(data.waitlist))
    }
  }, [waitlist])

  console.log(waitlist)
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
