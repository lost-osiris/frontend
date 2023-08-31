import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './layout/Main.jsx'
import { KanbanBoardPage } from '~/pages/KanbanBoard'
import { IssuePage } from './pages/Issue'
// import { ProjectList } from './pages/ProjectList'
import { CreateIssue } from './pages/CreateIssue'

import { Homepage } from './pages/HomePage'
import { KanbanBoardProvider } from '~/context'
import { ProjectPage } from './pages/Project'
import { EditProject } from './pages/EditProject.jsx'
import { UserPage } from './pages/UserPage'
import { BlogList } from './pages/BlogList.jsx'
import { CreateBlog } from './pages/CreateBlog.jsx'
import { Blog } from './pages/Blog.jsx'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout showComponent={'none'} />} path='/'>
        {/* routes without sidebar */}
        <Route element={<Homepage />} path='/' />
        <Route element={<UserPage />} path='/user/:discord_id' />
        <Route element={<BlogList />} path='/blogs' />
        <Route element={<CreateBlog />} path='/blogs/createblog' />
        <Route element={<Blog />} path='/blog/:blogId' />
      </Route>
      {/* routes with sidebar */}
      <Route element={<Layout />} path='/'>
        <Route element={<ProjectPage />} path='/project/:projectId' />
        <Route element={<EditProject />} path='/project/:projectId/edit' />

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
          element={<CreateIssue />}
          path='/project/:projectId/create-issue/:category'
        />
      </Route>
    </Routes>
  )
}

export default AppRoutes
