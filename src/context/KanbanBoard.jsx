import React, { useState, useEffect, createContext, useContext } from 'react'
import { useParams } from 'react-router-dom'

import * as api from '~/api'
import { toTitleCase } from '~/utils'

import { UserContext } from './Authentication'

export const KanbanBoardContext = createContext({
  issues: [],
  updateIssues: undefined,
})

export const KanbanBoardProvider = (props) => {
  const [allIssues, setIssues] = useState()
  const [loading, setLoading] = useState(true)
  const userInfo = useContext(UserContext)
  const params = useParams()

  const updateIssue = (issue) => {
    let issues = [...allIssues]

    issues = issues.map((value) => {
      if (value.id === issue.id) {
        return issue
      }
      return value
    })

    api
      .requests('put', `/api/project/${params.projectId}/issue/${issue.id}`, {
        alert: true,
        alertMessage: `Successfully updated "${
          issue.summary
        }" with status "${toTitleCase(issue.status)}"`,
        data: { issue, userInfo: userInfo.user },
      })
      .then(() => {
        setIssues(issues)
      })
  }

  const deleteIssue = (issue) => {
    setIssues([...allIssues.filter((value) => value.id !== issue.id)])
  }

  useEffect(() => {
    setIssues()
    setLoading(true)
  }, [params.category])

  useEffect(() => {
    if (loading) {
      api
        .requests(
          'get',

          `/api/project/${params.projectId}/category/${params.category}/issues`,
        )
        .then((data) => {
          if (loading && data) {
            setIssues(data)
            setLoading(false)
          }
        })
    }
  }, [loading, params.category])

  return (
    <KanbanBoardContext.Provider
      value={{
        deleteIssue: deleteIssue,
        issues: allIssues,
        issuesLoading: loading,
        updateIssue: updateIssue,
      }}
    >
      {props.children}
    </KanbanBoardContext.Provider>
  )
}
