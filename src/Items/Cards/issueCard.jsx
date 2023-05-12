import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/authprovider";
import { useNavigate, useParams } from "react-router-dom";
import { useDrag } from "react-dnd";

import axios from "axios";

import * as utils from "../../utils";

import {
  Card,
  CardContent,
  Button,
  IconButton,
  Typography,
  Chip,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Menu,
  ListItemText,
  ListItemIcon,
  FormGroup,
  Switch,
  FormControlLabel,
  Tooltip,
  Avatar,
  Fab,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import BugIcon from "@mui/icons-material/BugReport";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { toTitleCase } from "../../utils";

export const IssueCard = (props) => {
  let navigate = useNavigate();
  const issue = { ...props.issue };

  const userInfo = useContext(UserContext);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "issue",
    item: {
      issue: issue,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleCardDelete = () => {
    axios.delete(`/api/issue/${issue._id}`, { data: userInfo }).then(() => {
      if (props.onDelete) {
        props.onDelete();
      }
    });
  };

  const issueSummary =
    issue.summary.charAt(0).toUpperCase() + issue.summary.slice(1);

  let cardProps = { sx: { opacity: isDragging ? 0 : 1 } };
  if (!issue.archived) {
    cardProps.ref = drag;
  }

  return (
    <>
      <Card {...cardProps}>
        <CardContent sx={{ pt: 0.6, pr: 0, pl: 1, pb: 0 }}>
          <Grid container spacing={1}>
            <Box>
              <Grid item lg={2} sx={{ mt: 1 }}>
                {issue.type === "bug" && (
                  <Tooltip title="Bug" arrow>
                    <Fab
                      sx={{
                        transform: "scale(0.6)",
                        cursor: "default",
                        ":hover": "none",
                        boxShadow: "none",
                      }}
                      disableRipple
                      disableFocusRipple
                      color="info"
                    >
                      <BugIcon sx={{ transform: "scale(1.7)" }} />{" "}
                    </Fab>
                  </Tooltip>
                )}
                {issue.type === "suggestion" && (
                  <Tooltip title="Suggestion" arrow>
                    <Fab
                      sx={{
                        transform: "scale(0.6)",
                        cursor: "default",
                        ":hover": "none",
                        boxShadow: "none",
                      }}
                      disableRipple
                      disableFocusRipple
                      color="info"
                    >
                      <QuestionMarkIcon sx={{ transform: "scale(1.7)" }} />
                    </Fab>
                  </Tooltip>
                )}
              </Grid>
            </Box>

            <Grid item lg={9}>
              <Tooltip arrow title={utils.overflowLimiter(issue.description)}>
                <Box
                  component="h4"
                  sx={{
                    mt: 1,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      "&:hover": {
                        opacity: [0.9, 0.8, 0.7],
                        cursor: "pointer",
                        textDecoration: "underline",
                      },
                    }}
                    onClick={() => navigate(`/issue/${issue._id}`)}
                  >
                    {issueSummary}
                  </Box>
                </Box>
              </Tooltip>
            </Grid>
            <Grid item lg={12}>
              <Grid container>
                {issue.archived && (
                  <Grid item>
                    <Chip
                      avatar={
                        <Avatar
                          src="../../assets/oie_dbjR3Vwm6byi.png"
                          alt="..."
                        />
                      }
                      size="medium"
                      color={utils.getStatusColor(issue.status)}
                      label={toTitleCase(issue.status)}
                    />
                  </Grid>
                )}
                <Grid item lg={4} sx={{ mt: 1.3 }}>
                  {issue.priority === "high" && (
                    <Tooltip title="Issue Priority Level" arrow>
                      <Chip
                        avatar={
                          <Avatar
                            sx={{
                              maxWidth: "20px",
                              maxHeight: "20px",
                              minWidth: "20px",
                              minHeight: "20px",
                            }}
                            src={"/high.png"}
                          />
                        }
                        sx={{ fontWeight: 600, opacity: 0.9 }}
                        variant="outlined"
                        size="medium"
                        color={utils.getPriorityColor(issue.priority)}
                        label={toTitleCase(`${issue.priority}`)}
                      />
                    </Tooltip>
                  )}
                  {issue.priority === "medium" && (
                    <Tooltip title="Issue Priority Level" arrow>
                      <Chip
                        avatar={
                          <Avatar
                            sx={{
                              mt: 0.2,
                              pl: 0.6,
                              transform: "scale(0.4)",
                              maxWidth: "20px",
                              maxHeight: "20px",
                              minWidth: "20px",
                              minHeight: "20px",
                            }}
                            src={"/medium.png"}
                          />
                        }
                        sx={{ fontWeight: 600, opacity: 0.8 }}
                        variant="outlined"
                        size="medium"
                        color={utils.getPriorityColor(issue.priority)}
                        label={toTitleCase(`${issue.priority}`)}
                      />
                    </Tooltip>
                  )}
                  {issue.priority === "low" && (
                    <Tooltip title="Issue Priority Level" arrow>
                      <Chip
                        avatar={
                          <Avatar
                            sx={{
                              maxWidth: "20px",
                              maxHeight: "20px",
                              minWidth: "20px",
                              minHeight: "20px",
                            }}
                            src={"/low.png"}
                          />
                        }
                        sx={{ fontWeight: 600, opacity: 0.8 }}
                        variant="outlined"
                        size="medium"
                        color={utils.getPriorityColor(issue.priority)}
                        label={toTitleCase(`${issue.priority}`)}
                      />
                    </Tooltip>
                  )}
                </Grid>
                {/* <Grid item lg={2} sx={{ textAlign: "center" }}>
                  <Chip
                  size="small"
                  color={utils.getTypeColor(issue.type)}
                  label={toTitleCase(issue.type)}
                />

                  {issue.type === "bug" && (
                  <Chip
                    size="small"
                    color={utils.getTypeColor(issue.type)}
                    label={<BugIcon sx={{ pt: 0.7 }} />}
                  ></Chip>
                )}
                </Grid> */}
                <Grid item sx={{ mt: 1 }} lg={5}>
                  <Fab
                    sx={{
                      mt: 0.2,
                      fontWeight: 600,

                      transform: "scale(0.95)",
                      // opacity: 0.8,
                      // cursor: "default",
                      // ":hover": "none",
                      boxShadow:
                        "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0.12)",
                    }}
                    variant="extended"
                    size="small"
                    color="warning"
                  >
                    <ArchiveIcon sx={{ mr: 1 }} />
                    Archive
                  </Fab>
                </Grid>

                <Grid item lg={1}>
                  <Avatar
                    sx={{
                      mt: 0.7,
                      cursor: "pointer",
                      ":hover": {
                        boxShadow:
                          "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0.12)",
                      },
                    }}
                    onClick={() => navigate(`/user/${issue.playerData.id}`)}
                    src={`https://cdn.discordapp.com/avatars/${issue.playerData.id}/${issue.playerData.avatar}.png`}
                    alt={issue.playerData.name}
                  />
                </Grid>
              </Grid>

              {/* <Box component="span" sx={{ pr: 1 }}>
                <IconButton size="small" color="danger">
                  <CloseIcon />
                </IconButton>
              </Box> */}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};
