import React, { useState, useContext } from "react";
import { UserContext } from "../../Context/authprovider";
import { useNavigate, useParams } from "react-router-dom";
import { useDrag } from "react-dnd";
import { CardChip } from "../../Components/Chip";
import { HighPriorityIcon } from "../../Components/HighPrioIcon";
import { LowPriorityIcon } from "../../Components/LowPrioIcon";
import { MediumPriorityIcon } from "../../Components/MediumPrioIcon";

import * as utils from "../../Utils";

import {
  Card,
  CardContent,
  IconButton,
  Menu,
  Box,
  Grid,
  Typography,
  Divider,
  ListItemText,
  ListItemIcon,
  MenuItem,
  Avatar,
  Stack,
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
  const hasContributor = userInfo.user.projects.find(
    (value) =>
      value.id === params.projectId && value.roles.indexOf("contributor")
  );

  console.log(issue);

  const canEdit =
    hasContributor || issue.discord_id === userInfo.user.discord_id;

  const handleCardDelete = () => {
    utils
      .requests("delete", `/api/issue/${issue.id}`, { data: userInfo.user })
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
                    onClick={() => navigate(`/issue/${issue.id}`)}
                  >
                    <Typography>{issueSummary}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
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
                  onClick={() => navigate(`/issue/${issue.id}`)}
                >
                  {issueSummary}
                </Box>
              </Box>
            </Grid>
            {userInfo && canEdit && (
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
                          userInfo: userInfo.user,
                        };

                        utils.requests(
                          "put",
                          `/api/issue/${props.issue.id}`,
                          data
                        );
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
            )}
          </Grid>
          <Grid container spacing={0}>
            <Grid item sx={{ mt: 1, textAlign: "left" }} lg={11}>
              <Stack direction="row" spacing={1}>
                {issue.type === "bug" && (
                  <CardChip color="info" label="Type" img={<BugReportIcon />} />
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

            <Grid item lg={1}>
              <Avatar
                sx={{
                  mt: 0.7,
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
          <Box component="span" sx={{ pr: 1 }}>
            <IconButton size="small" color="danger"></IconButton>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};
