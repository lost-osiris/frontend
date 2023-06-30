import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Context/authprovider";
import { useNavigate, useParams } from "react-router-dom";
import { useDrag } from "react-dnd";

import * as utils from "../../Utils";

import {
  Card,
  CardContent,
  IconButton,
  Chip,
  Menu,
  Box,
  Grid,
  Typography,
  Divider,
  ListItemText,
  ListItemIcon,
  MenuItem,
  Avatar,
  Fab,
} from "@mui/material";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import BugReportIcon from "@mui/icons-material/BugReport";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

export const IssueCard = (props) => {
  const [menuOpen, setMenuOpen] = useState(null);
  const userInfo = useContext(UserContext);
  const params = useParams();
  const navigate = useNavigate();
  const issue = { ...props.issue };
  const issueSummary =
    issue.summary.charAt(0).toUpperCase() + issue.summary.slice(1);
  const hasContributor = userInfo.data.projects.find(
    (value) =>
      value.id === params.projectId && value.roles.indexOf("contributor")
  );

  const canEdit =
    hasContributor || issue.playerData.id === userInfo.data.discord_id;

  const handleCardDelete = () => {
    utils
      .requests("delete", `/api/issue/${issue.id}`, { data: userInfo.data })
      .then(() => {
        if (props.onDelete) {
          props.onDelete();
        }
      });
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "issue",
    item: {
      issue: issue,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  let cardProps = { sx: { opacity: isDragging ? 0 : 1 } };

  if (!issue.archived && canEdit) {
    cardProps.ref = drag;
  }

  return (
    <>
      <Card
        {...cardProps}
        sx={{
          "&:hover": {
            boxShadow: canEdit
              ? "0px 3px 5px -1px rgba(255,255,255,0.2), 0px 6px 2px 0px rgba(255,255,255,0.14), 0px 1px 5px 0px rgba(255,255,0.12)"
              : "",
          },
        }}
      >
        <CardContent
          sx={{
            pt: 0,
            pr: 0,
            pl: 1,
            pb: 0,
            mb: -4,
            cursor: canEdit ? "grab" : "",
          }}
        >
          {!userInfo && (
            <Grid container>
              <Grid item lg={12}>
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
                    <Typography>{issueSummary}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
          {userInfo && (
            <Grid container>
              <Grid item lg={10.5}>
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
              </Grid>

              <Grid item lg={1.5}>
                <IconButton
                  sx={{ pt: 1 }}
                  onClick={(e) => {
                    setMenuOpen(e.currentTarget);
                  }}
                  aria-controls={Boolean(menuOpen) ? "menu" : undefined}
                  aria-expanded={Boolean(menuOpen) ? "true" : undefined}
                  aria-haspopup="true"
                >
                  <MoreHorizIcon />
                </IconButton>
                <Menu
                  anchorEl={menuOpen}
                  open={Boolean(menuOpen)}
                  onClose={() => setMenuOpen(null)}
                  onClick={() => setMenuOpen(null)}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  id="menu"
                >
                  <MenuItem
                    onClick={() => {
                      if (
                        issue.status === "completed" ||
                        issue.status === "won't-fix"
                      ) {
                        issue.archived = !issue.archived;
                        let data = {
                          issue,
                          userInfo: userInfo,
                        };
                        utils
                          .requests(
                            "get",
                            `/api/project/63fe47296edfc3b387628861/member/${userInfo.data.discord_id}`
                          )
                          .then((res) => {
                            if (res.status === 204) {
                              utils.requests(
                                "put",
                                `/api/issue/${props.issue.id}`,
                                data
                              );
                            }
                          });
                      } else {
                        window.alert(
                          'Status must be "Completed" or "Won\'t Fix" in order to archive'
                        );
                      }
                    }}
                  >
                    <ListItemIcon>
                      {issue.archived ? (
                        <UnarchiveIcon fontSize="small" color="warning" />
                      ) : (
                        <ArchiveIcon fontSize="small" color="warning" />
                      )}
                    </ListItemIcon>
                    {issue.archived ? (
                      <ListItemText>Unarchive</ListItemText>
                    ) : (
                      <ListItemText>Archive</ListItemText>
                    )}
                  </MenuItem>

                  <Divider />
                  <MenuItem onClick={handleCardDelete}>
                    <ListItemIcon>
                      <CloseIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
          )}{" "}
          <Grid container spacing={2}>
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

            <Grid item lg={4}>
              <Avatar
                sx={{
                  mt: 0.7,
                  ml: 7,
                  cursor: "pointer",
                  ":hover": {
                    boxShadow:
                      "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0.12)",
                  },
                }}
                onClick={() => navigate(`/user/${issue.playerData.id}`)}
                src={`https://cdn.discordapp.com/avatars/${issue.playerData.discord_id}/${issue.playerData.avatar}.png`}
                alt={issue.playerData.name}
              />
            </Grid>
          </Grid>
          <Box component="span" sx={{ pr: 1 }}>
            <IconButton size="small" color="danger"></IconButton>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};
