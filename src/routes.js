import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './layout/Main'
import { KanbanBoardPage } from '~/pages/KanbanBoard'
import { IssuePage } from './pages/Issue'
// import { ProjectList } from './pages/ProjectList'
import { CreateIssue } from './pages/CreateIssue'
import { JoinWaitlist } from './pages/JoinWaitList'
import { ManageWaitlist } from './pages/ManageWaitList'
import { Homepage } from './pages/HomePage'
import { KanbanBoardProvider } from '~/context'
import { ProjectPage } from './pages/Project'
import { CreateEditProject } from './pages/CreateEditProject'
import { UserPage } from './pages/UserPage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />} path='/'>
        <Route element={<Homepage />} path='/' />
        {/* <Route element={<ProjectList />} path='/projects' /> */}
        <Route element={<ProjectPage />} path='/project/:projectId' />
        <Route element={<CreateEditProject />} path='/project/create' />
        <Route
          element={<CreateEditProject />}
          path='/project/:projectId/edit'
        />
        <Route
          element={<JoinWaitlist />}
          path='/project/:projectId/joinwaitlist'
        />
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
        <Route
          element={<IssuePage />}
          path='/project/:projectId/issue/:issueId'
        />
        <Route
          // do we need this
          element={<CreateIssue />}
          path='/project/:projectId/create-issue/:category'
        />
        <Route element={<UserPage />} path='/user/:discord_id' />
      </Route>
    </Routes>
  )
}

export default AppRoutes
