import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Context/authprovider";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Grid,
  Avatar,
  CircularProgress,
  Box,
  Typography,
  CardContent,
  Card,
  CardHeader,
  Tabs,
  Tab,
} from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import BugReportIcon from "@mui/icons-material/BugReport";

import * as utils from "../../Utils";
import Loading from "../../Components/Loading";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  console.log(index, value);
  return (
    <div role="tabpanel" hidden={value !== index} id={value} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export const IssuePage = () => {
  const userInfo = useContext(UserContext);
  let params = useParams();
  let navigate = useNavigate();
  let [issue, setIssue] = useState(null);
  let [tabValue, setTabValue] = useState("details");
  let [editIssue, setEditIssue] = useState({ issue: null, toggle: false });

  const handleTabChange = (_, tab) => {
    setTabValue(tab);
  };

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

  return (
    <div>
      <Grid container>
        <Grid item lg={12}>
          <Card>
            <CardContent>
              <Grid container>
                <Grid item lg={12}>
                  <Typography variant="h4" sx={{ textAlign: "center" }}>
                    {issue.summary}
                  </Typography>
                </Grid>
                <Grid item lg={12} sx={{ mt: 5 }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                  >
                    <Tab label="Details" id="details" />
                    <Tab label="Attachments" id="attachments" />
                    <Tab label="Mod Logs" id="mog-logs" />
                  </Tabs>
                  <TabPanel value={tabValue} index={0}>
                    <pre>{JSON.stringify(issue, null, 2)}</pre>
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    Attachments
                  </TabPanel>
                  <TabPanel value={tabValue} index={2}>
                    Mod Logs
                  </TabPanel>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
