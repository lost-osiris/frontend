import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Context/authprovider";
import { useParams, useNavigate } from "react-router-dom";
import { CardChip } from "../../Components/Chip";
import { HighPriorityIcon } from "../../Components/HighPrioIcon";
import { LowPriorityIcon } from "../../Components/LowPrioIcon";
import { MediumPriorityIcon } from "../../Components/MediumPrioIcon";

import {
  Grid,
  Avatar,
  Box,
  Typography,
  CardContent,
  Card,
  Tabs,
  Tab,
  Divider,
  Stack,
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
  let [tabValue, setTabValue] = useState(0);
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
                <Grid item lg={8}>
                  <Typography variant="h4">{issue.summary}</Typography>
                </Grid>
                <Grid item lg={4}>
                  <Typography
                    variant="h4"
                    textAlign="center"
                    sx={{
                      borderRadius: "5px",
                      opacity: 0.9,
                      bgcolor: utils.getStatusColorHk(issue.status),
                      borderColor: utils.getStatusColorHk(issue.status),
                    }}
                  >
                    {issue.status
                      .split(" ")
                      .map((s) => utils.toTitleCase(s))
                      .join(" ")}
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
                    <Grid container spacing={2}>
                      <Grid item lg={8}>
                        <Stack direction="row" spacing={1}>
                          {issue.type === "bug" && (
                            <CardChip
                              color="info"
                              label="Type"
                              img={<BugReportIcon />}
                            />
                          )}
                          {issue.type === "suggestion" && (
                            <CardChip
                              color="info"
                              label="Type"
                              img={<QuestionMarkIcon />}
                            />
                          )}
                          {issue.priority === "low" && (
                            <CardChip
                              color="info"
                              label="Priority"
                              img={<LowPriorityIcon />}
                            />
                          )}
                          {issue.priority === "medium" && (
                            <CardChip
                              color="warning"
                              label="Priority"
                              img={<MediumPriorityIcon />}
                            />
                          )}
                          {issue.priority === "high" && (
                            <CardChip
                              color="error"
                              label="Priority"
                              img={<HighPriorityIcon />}
                            />
                          )}
                        </Stack>
                      </Grid>
                      <Grid item lg={4}>
                        User Shit
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item lg={12}>
                        <Typography sx={{}} variant="h5">
                          Description
                        </Typography>
                      </Grid>
                      <Grid item lg={12}>
                        <Typography variant="body">
                          {issue.description}
                        </Typography>
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    Attachments
                    <pre>{JSON.stringify(issue, null, 2)}</pre>
                  </TabPanel>
                  <TabPanel value={tabValue} index={2}>
                    Mod Logs
                    <pre>{JSON.stringify(issue, null, 2)}</pre>
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
