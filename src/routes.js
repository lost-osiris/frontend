import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './layout/Main'
import { KanbanBoardPage } from '~/pages/KanbanBoard'
import { IssuePage } from './pages/Issue'
import { ProjectList } from './pages/ProjectList'
import { CreateIssue } from './pages/CreateIssue'
import { JoinWaitlist } from './pages/JoinWaitList'
import { ManageWaitlist } from './pages/ManageWaitList'
import { Homepage } from './pages/HomePage'
import { KanbanBoardProvider } from '~/context'
import { ProjectPage } from './pages/Project'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />} path='/'>
        <Route element={<Homepage />} path='/home' />
        <Route element={<ProjectList />} path='/projects' />
        <Route element={<ProjectPage />} path='/project/:projectId' />
        <Route
          element={<JoinWaitlist />}
          path='/project/:projectId/joinwaitlist'
        />
        {/* TODO: need to specify project id */}
        <Route
          element={<ManageWaitlist />}
          path='/project/:projectId/managewaitlist'
        />
        <Route
          element={<CreateIssue />}
          path='/project/:projectId/create-issue'
        />
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
