import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './layout/Main'
import { KanbanBoardPage } from '~/pages/KanbanBoard'
import { IssuePage } from './pages/Issue'
import { ProjectList } from './pages/ProjectList'
import { CreateIssue } from './pages/CreateIssue'
import { JoinWaitlist } from './pages/JoinWaitList'
import { ManageWaitlist } from './pages/ManageWaitList'
import { KanbanBoardProvider } from '~/context'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />} path='/'>
        <Route element={<ProjectList />} path='/projects' />
        <Route
          element={<JoinWaitlist />}
          path='/project/:projectId/joinwaitlist'
        />
        {/* TODO: need to specify project id */}
        <Route
          element={<ManageWaitlist />}
          path='/project/:projectId/managewaitlist'
        />
        <Route element={<CreateIssue />} path='/create-issue/:category' />
        <Route
          element={
            <KanbanBoardProvider>
              <KanbanBoardPage />
            </KanbanBoardProvider>
          }
          path='/project/:projectId/issues/:category'
        />
        <Route element={<IssuePage />} path='/issue/:issueId' />
        <Route
          element={<CreateIssue />}
          path='/project/:projectId/create-issue/:category'
        />
      </Route>
    </Routes>
  )
}

export default AppRoutes
