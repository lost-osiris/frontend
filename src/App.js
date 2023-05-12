import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Header } from "./Header/header";
import { IssueCardList } from "./Pages/IssueList/issueList";
import { IssuePage } from "./Pages/Issue/issue";
import { ProjectCardList } from "./Pages/ProjectList/projectList";
import { UserForm } from "./Pages/SubmissionForm/form.jsx";
import { IssuesProvider, UserProvider } from "./context";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <BrowserRouter>
          <UserProvider>
            <DndProvider backend={HTML5Backend}>
              <Routes>
                <Route path="/" element={<Header />}>
                  <Route path="/projects" element={<ProjectCardList />} />
                  <Route path="/form" element={<UserForm />} />
                  <Route
                    path="/issues/:category"
                    element={
                      <IssuesProvider>
                        <IssueCardList />
                      </IssuesProvider>
                    }
                  />
                  <Route path="/issue/:issueId" element={<IssuePage />} />
                </Route>
              </Routes>
            </DndProvider>
          </UserProvider>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;
