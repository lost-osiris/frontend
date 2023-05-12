import React, { useState, useEffect, createContext, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import * as utils from "../utils";

import { UserContext } from "./authprovider";
export const IssuesContext = createContext({
  issues: [],
  updateIssues: undefined,
});

export const IssuesProvider = (props) => {
  const [allIssues, setIssues] = useState([]);
  const userInfo = useContext(UserContext);
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const archived = searchParams.get("archived") === "true";

  const updateIssue = (issue) => {
    let issues = [...allIssues];

    issues = issues.map((value) => {
      if (value._id === issue._id) {
        return issue;
      }
      return value;
    });

    utils
      .requests("put", `/api/issue/${issue._id}`, {
        data: { issue, userInfo: userInfo },
      })
      .then(() => {
        setIssues(issues);
      });
  };

  const deleteIssue = (issue) => {};

  useEffect(() => {
    if (!allIssues) {
      utils
        .requests(
          "get",
          `/api/project/Pale-Court/category/${params.category}/issues`
        )
        .then((data) => setIssues(data));
    }
  });

  useEffect(() => {
    if (allIssues) {
      utils
        .requests(
          "get",
          `/api/project/Pale-Court/category/${params.category}/issues`
        )
        .then((data) => setIssues(data));
    }
  }, [params.category]); // eslint-disable-line

  return (
    <IssuesContext.Provider
      value={{ issues: allIssues, updateIssue: updateIssue }}
    >
      {props.children}
    </IssuesContext.Provider>
  );
};
