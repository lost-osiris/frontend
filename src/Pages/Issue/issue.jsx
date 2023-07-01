import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Context/authprovider";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { Grid, Avatar, CircularProgress, Box, Typography } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import BugReportIcon from "@mui/icons-material/BugReport";

import * as utils from "../../Utils";
import Loading from "../../Components/Loading";

export const IssuePage = () => {
  const userInfo = useContext(UserContext);
  let params = useParams();
  let navigate = useNavigate();
  let [issue, setIssue] = useState(null);
  let [editIssue, setEditIssue] = useState({ issue: null, toggle: false });

  useEffect(() => {
    if (issue === null) {
      utils
        .requests("get", `/api/issue/${params.issueId}`)
        .then((data) => setIssue(data));
    }
  });

  // const toggleEdit = (issue) => {
  //   setEditIssue({ issue: issue, toggle: !editIssue.toggle });
  // };

  if (!issue) {
    return <Loading />;
  }

  return <div></div>;
};
