import React, { useState, useEffect, useContext } from "react";
import { UserContext, CategoriesContext } from "../../Context";
import { useParams, useNavigate } from "react-router-dom";

import {
  Grid,
  Avatar,
  Box,
  Typography,
  CardContent,
  Card,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import EditIcon from "@mui/icons-material/Edit";
import SuggectionIcon from "@mui/icons-material/TipsAndUpdates";

import * as utils from "../../Utils";
import Loading from "../../Components/Loading";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
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
  let params = useParams();
  let navigate = useNavigate();
  let [issue, setIssue] = useState(null);
  let [tabValue, setTabValue] = useState(0);
  const userInfo = useContext(UserContext);
  const categories = useContext(CategoriesContext);
  const hasMaintainer = userInfo.user.projects.find(
    (value) =>
      value.id === params.projectId && value.roles.indexOf("maintainer") >= 0
  );

  const canEdit =
    hasMaintainer || issue?.discord_id === userInfo.user.discord_id;

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

  if (!issue || categories === undefined) {
    return <Loading />;
  }

  return (
    <div>
      <Grid container sx={{ mb: 4, ml: 4 }} justifyContent="center">
        <Grid item lg={2} sx={{ mt: 2 }}>
          <Grid container spacing={1} direction="row" justifyContent="left">
            <Grid item>
              <Typography variant="h4" textAlign="center">
                {issue.playerData.username}
              </Typography>
            </Grid>
            <Grid item>
              <Avatar
                sx={{
                  // mt: 0.7,
                  ml: 0,
                  // cursor: "pointer",
                  // ":hover": {
                  //   boxShadow:
                  //     "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0.12)",
                  // },
                }}
                // onClick={() => navigate(`/user/${issue.discord_id}`)}
                src={`https://cdn.discordapp.com/avatars/${issue.discord_id}/${issue.playerData.avatar}.png`}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={canEdit ? 9 : 10}>
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            {issue.summary}
          </Typography>
        </Grid>
        {canEdit && (
          <Grid item lg={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() =>
                navigate(`/project/63fe47296edfc3b387628861/form`, {
                  state: issue,
                })
              }
            >
              <EditIcon />
              Edit
            </Button>
          </Grid>
        )}
      </Grid>
      <Grid container>
        <Grid item lg={12}>
          <Card>
            <CardContent>
              <Grid container>
                <Grid item lg={4}>
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="center"
                  >
                    <Grid item>
                      <Typography variant="h4" textAlign="center">
                        Type:
                      </Typography>
                    </Grid>
                    <Grid item>
                      {issue.type === "bug" && (
                        <BugReportIcon
                          sx={{ fontSize: "3rem" }}
                          color="warning"
                        />
                      )}
                      {issue.type === "suggestion" && (
                        <SuggectionIcon sx={{ fontSize: "3rem" }} />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={4}>
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="center"
                  >
                    <Grid item>
                      <Typography variant="h4" textAlign="center">
                        Priority:
                      </Typography>
                    </Grid>
                    <Grid item>
                      {issue.priority === "low" && (
                        <DoubleArrowIcon
                          color="info"
                          sx={{
                            transform: "rotate(90deg)",
                            fontSize: "3rem",
                          }}
                        />
                      )}
                      {issue.priority === "medium" && (
                        <DragHandleIcon
                          color="warning"
                          sx={{ fontSize: "3rem" }}
                        />
                      )}
                      {issue.priority === "high" && (
                        <DoubleArrowIcon
                          color="error"
                          sx={{ transform: "rotate(-90deg)", fontSize: "3rem" }}
                        />
                      )}
                    </Grid>
                  </Grid>
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
                    <Tab label="Description" id="Description" />
                    <Tab label="Attachments" id="attachments" />
                    <Tab label="Mod Logs" id="mog-logs" />
                  </Tabs>
                  <TabPanel value={tabValue} index={0}>
                    <Grid container>
                      <Grid item lg={12}>
                        <Typography variant="h5">
                          {issue.description}
                        </Typography>
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    {!issue.attachments.embedSource &
                    !issue.attachments.generalUrl ? (
                      <Grid container justifyContent="center">
                        <Grid item>
                          <Typography
                            variant="h6"
                            sx={{ fontStyle: "italic", textAlign: "center" }}
                          >
                            No Attachments Set
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : (
                      <>
                        <Grid container justifyContent="center">
                          <Grid item>
                            <Box
                              component="span"
                              sx={{
                                "&:hover": {
                                  opacity: [0.9, 0.8, 0.7],
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                },
                              }}
                              onClick={() =>
                                window.open(
                                  issue.attachments.generalUrl,
                                  "_blank"
                                )
                              }
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  fontStyle: "italic",
                                  textAlign: "center",
                                }}
                              >
                                View Attachment URL
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        <Grid container justifyContent="center" sx={{ mt: 2 }}>
                          {issue.attachments.generalUrl && (
                            <Grid item>
                              <iframe
                                title="issue-attachment-general-url"
                                src={`${issue.attachments.generalUrl}`}
                                style={{
                                  width: "75vw",
                                  height: "95vh",
                                  overflow: "visible",
                                }}
                                frameBorder="0"
                              />
                            </Grid>
                          )}
                          {issue.attachments.embedSource && (
                            <Grid item>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: issue.attachments.embedSource,
                                }}
                              ></div>
                            </Grid>
                          )}
                        </Grid>
                      </>
                    )}
                  </TabPanel>
                  <TabPanel value={tabValue} index={2}>
                    <Grid container justifyContent="center">
                      <Grid item>
                        <Typography
                          variant="h6"
                          sx={{ fontStyle: "italic", textAlign: "center" }}
                        >
                          {issue.modlogs.title}
                        </Typography>
                      </Grid>
                    </Grid>
                    <pre>{issue.modlogs.body}</pre>
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
