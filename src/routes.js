import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout/main";
import { IssueCardList } from "./Pages/IssueList/issueList";
import { IssuePage } from "./Pages/Issue/issue";
import { ProjectCardList } from "./Pages/ProjectList/projectList";
import { UserForm } from "./Pages/SubmissionForm/form.jsx";
import { JoinWaitlist } from "./Pages/Waitlist/joinWaitlist";
import { ManageWaitlist } from "./Pages/Waitlist/manageWaitlist";
import { IssuesProvider } from "./Context";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/projects" element={<ProjectCardList />} />
        <Route
          path="/project/:projectId/joinwaitlist"
          element={<JoinWaitlist />}
        />
        {/* TODO: need to specify project id */}
        <Route
          path="/project/:projectId/managewaitlist"
          element={<ManageWaitlist />}
        />
        <Route path="/form" element={<UserForm />} />
        <Route
          path="/project/:projectId/issues/:category"
          element={
            <IssuesProvider>
              <IssueCardList />
            </IssuesProvider>
          }
        />
        <Route path="/issue/:issueId" element={<IssuePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
