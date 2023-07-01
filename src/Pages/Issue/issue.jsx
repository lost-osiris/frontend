import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Context/authprovider";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { Grid, Avatar, CircularProgress, Box, Typography } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import BugReportIcon from "@mui/icons-material/BugReport";

export const IssuePage = () => {
  const userInfo = useContext(UserContext);
  let params = useParams();
  let navigate = useNavigate();
  let [issue, setIssue] = useState(null);
  let [editIssue, setEditIssue] = useState({ issue: null, toggle: false });

  useEffect(() => {
    if (issue === null) {
      axios
        .get(`/api/issue/${params.issueId}`)
        .then((res) => setIssue(res.data));
    }
  });

  // const toggleEdit = (issue) => {
  //   setEditIssue({ issue: issue, toggle: !editIssue.toggle });
  // };

  if (!issue) {
    return (
      <div
        style={{
          position: "absolute",
          left: "55%",
          top: "52%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Grid container>
        <Grid
          item
          lg={3}
          // sx={{ borderStyle: "dashed" }}
        >
          <Grid container>
            <Grid
              container
              sx={{
                backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 75%, ${issue.playerData.banner_color} 100%), url(https://cdn.discordapp.com/banners/${issue.playerData.id}/${issue.playerData.banner}.png)`,
                backgroundSize: "100%",
                // borderStyle: "dashed",
                minHeight: "100px",
                // minWidth: "360px",
              }}
            ></Grid>
            <Grid item lg={6}>
              <Grid
                container
                sx={{
                  backgroundColor: `${issue.playerData.banner_color}`,
                  opacity: "100%",
                  // borderColor: "blue",
                  // borderStyle: "dashed",
                  // minHeight: "100px",
                  // minWidth: "360px",
                }}
              >
                <Grid item lg={6} sx={{ m: 0.4 }}>
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      ml: 7,
                      mt: 2,
                      cursor: "pointer",
                      ":hover": {
                        boxShadow:
                          "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0.12)",
                      },
                      textAlign: "center",
                    }}
                    onClick={() => navigate(`/user/${issue.playerData.id}`)}
                    src={`https://cdn.discordapp.com/avatars/${issue.playerData.id}/${issue.playerData.avatar}.png`}
                    alt={issue.playerData.name}
                  />
                </Grid>
                <Grid item lg={6} sx={{ m: 2, ml: 6.7 }}>
                  {issue.playerData.name}
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={6}>
              <Grid
                container
                sx={{
                  backgroundColor: `${issue.playerData.banner_color}`,
                  opacity: "100%",
                  // borderColor: "blue",
                  // borderStyle: "dashed",
                  // minHeight: "100px",
                  // minWidth: "360px",
                }}
              >
                <Grid item lg={6} sx={{ m: 3 }}>
                  Created at:
                </Grid>
                <Grid item lg={6} sx={{ m: 2, ml: 3 }}>
                  Updated at:
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          lg={6}
          // sx={{ borderStyle: "dashed" }}
          key={`${JSON.stringify(issue)}`}
        >
          <Grid container>
            <Box
              sx={{
                opacity: "100%",
                // borderColor: "blue",
                // borderStyle: "dashed",
                // minHeight: "100px",
                minWidth: "723px",
              }}
            >
              {issue.summary}
            </Box>
            <Box
              sx={{
                opacity: "100%",
                // borderColor: "blue",
                // borderStyle: "dashed",
                // minHeight: "100px",
                minWidth: "723px",
              }}
            >
              <Grid container>
                <Grid item lg={4}>
                  {issue.status}
                </Grid>
                <Grid item lg={4}>
                  {issue.type === "bug" && (
                    <Grid item sx={{ mt: 1 }} lg={3.5}>
                      <Grid
                        container
                        sx={{
                          borderRadius: 5,
                          borderStyle: "solid",
                          borderColor: "info.dark",
                        }}
                      >
                        <Grid
                          item
                          sx={{
                            ml: 0,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            bgcolor: "info.dark",
                          }}
                          lg={8}
                        >
                          <Typography sx={{ fontWeight: 800, ml: 1 }}>
                            Type
                          </Typography>
                        </Grid>
                        <Grid item lg={3} sx={{ maxHeight: "20px", pr: 0.2 }}>
                          <BugReportIcon />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {issue.type === "suggestion" && (
                    <Grid item sx={{ mt: 1 }} lg={3.5}>
                      <Grid
                        container
                        sx={{
                          borderRadius: 5,
                          borderStyle: "solid",
                          borderColor: "info.dark",
                        }}
                      >
                        <Grid
                          item
                          sx={{
                            ml: 0,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            bgcolor: "info.dark",
                          }}
                          lg={8}
                        >
                          <Typography sx={{ fontWeight: 800, ml: 1 }}>
                            Type
                          </Typography>
                        </Grid>
                        <Grid item lg={3} sx={{ maxHeight: "20px", pr: 0.2 }}>
                          <QuestionMarkIcon />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                <Grid item lg={4}>
                  {issue.priority === "low" && (
                    <Grid item sx={{ mt: 1 }} lg={4}>
                      <Grid
                        container
                        sx={{
                          borderRadius: 5,
                          borderStyle: "solid",
                          borderColor: "info.dark",
                        }}
                      >
                        <Grid
                          item
                          sx={{
                            ml: 0,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            bgcolor: "info.dark",
                          }}
                          lg={9}
                        >
                          <Typography sx={{ fontWeight: 800, ml: 1 }}>
                            Priority
                          </Typography>
                        </Grid>
                        <Grid item lg={3} sx={{ maxHeight: "20px", pr: 0.2 }}>
                          <img src="/low.svg" alt="low" />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {issue.priority === "medium" && (
                    <Grid item sx={{ mt: 1 }} lg={4}>
                      <Grid
                        container
                        sx={{
                          borderRadius: 5,
                          borderStyle: "solid",
                          borderColor: "warning.dark",
                        }}
                      >
                        <Grid
                          item
                          sx={{
                            ml: 0,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            bgcolor: "warning.dark",
                          }}
                          lg={9}
                        >
                          <Typography sx={{ fontWeight: 800, ml: 1 }}>
                            Priority
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          lg={3}
                          sx={{ maxHeight: "20px", pr: 0.2, pt: 0.22 }}
                        >
                          <img src="/medium.svg" alt="medium" />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {issue.priority === "high" && (
                    <Grid item sx={{ mt: 1 }} lg={4}>
                      <Grid
                        container
                        sx={{
                          borderRadius: 5,
                          borderStyle: "solid",
                          borderColor: "error.main",
                        }}
                      >
                        <Grid
                          item
                          sx={{
                            ml: 0,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            bgcolor: "error.main",
                          }}
                          lg={9}
                        >
                          <Typography sx={{ fontWeight: 800, ml: 1 }}>
                            Priority
                          </Typography>
                        </Grid>
                        <Grid item lg={3} sx={{ maxHeight: "20px", pr: 0.2 }}>
                          <img src="/high.svg" alt="high" />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Grid
          item
          lg={3}
          // sx={{ borderStyle: "dashed" }}
          key={`${JSON.stringify(issue)}`}
        ></Grid>
      </Grid>
    </div>
  );
};
