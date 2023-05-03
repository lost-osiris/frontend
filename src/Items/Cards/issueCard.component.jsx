import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/authprovider.component";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

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
  Link,
  Avatar,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import { toTitleCase } from "../../utils";

const getStatusColor = (status) => {
  switch (status) {
    case "reported":
      return "default";
    case "in-progress":
      return "warning";
    case "completed":
      return "success";
    case "won't-fix":
      return "success";
    case "closed":
      return "success";
    default:
      return "default";
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case "bug":
      return "warning";
    case "suggestion":
      return "primary";
    case "feature-request":
      return "secondary";
    default:
      return "default";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "low":
      return "primary";
    case "medium":
      return "warning";
    case "high":
      return "error";
    default:
      return "default";
  }
};

export const IssueCard = (props) => {
  let navigate = useNavigate();
  const [issue, setIssue] = useState({ ...props.issue });
  const userInfo = useContext(UserContext);
  const [toggleModlogs, setToggleModlogs] = useState(false);
  const [modlogs, setModlogs] = useState("");
  const [toggleAttachments, setToggleAttachments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const params = useParams();

  const hasAttachments =
    issue.attachments.generalUrl !== "" || issue.attachments.embedSource !== "";

  const handleCardDelete = () => {
    axios.delete(`/api/issue/${issue._id}`, { data: userInfo }).then(() => {
      if (props.onDelete) {
        props.onDelete();
      }
    });
  };

  const handleModlogsToggle = () =>
    !toggleModlogs ? setToggleModlogs(true) : setToggleModlogs(false);

  const handleAttachmentsToggle = () =>
    !toggleAttachments
      ? setToggleAttachments(true)
      : setToggleAttachments(false);

  useEffect(() => {
    if (toggleModlogs && !modlogs) {
      axios
        .get(`/api/issue/${issue._id}/modlogs`)
        .then((res) => setModlogs(res.data));
    }

    if (!toggleModlogs && modlogs) {
      setModlogs(null);
    }
  }, [toggleModlogs, modlogs]);

  const issueSummary =
    issue.summary.charAt(0).toUpperCase() + issue.summary.slice(1);

  return (
    <>
      <Card>
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={2}>
            <Grid item lg="1">
              <Avatar
                onClick={() => navigate(`/user/${issue.playerData.id}`)}
                src={`https://cdn.discordapp.com/avatars/${issue.playerData.id}/${issue.playerData.avatar}.png`}
                alt={issue.playerData.name}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item lg="10">
              <Box
                component="h4"
                sx={{
                  ml: 1,
                  mt: 3,
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
                  {params.issueId
                    ? issueSummary
                    : issueSummary.length > 45
                    ? issueSummary.slice(0, 40) + "..."
                    : issueSummary}
                </Box>
              </Box>
            </Grid>
            <Grid item lg="1" sx={{ mt: 2, textAlign: "right" }}>
              <IconButton
                onClick={(e) => {
                  setMenuOpen(e.currentTarget);
                }}
                aria-controls={Boolean(menuOpen) ? "menu" : undefined}
                aria-expanded={Boolean(menuOpen) ? "true" : undefined}
                aria-haspopup="true"
              >
                <MoreVertIcon />
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
                {issue.modlogs && (
                  <MenuItem onClick={handleModlogsToggle}>
                    <ListItemIcon>
                      <ArticleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Mod Logs</ListItemText>
                  </MenuItem>
                )}

                {hasAttachments && (
                  <MenuItem onClick={handleAttachmentsToggle}>
                    <ListItemIcon>
                      <AttachFileIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Attachment</ListItemText>
                  </MenuItem>
                )}

                {((userInfo && hasAttachments) || issue.modlogs) && <Divider />}
                {userInfo && (
                  <div>
                    <MenuItem onClick={() => props.toggleEdit(issue)}>
                      <ListItemIcon>
                        <EditIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText>Edit</ListItemText>
                    </MenuItem>
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
                          axios.put(`/api/issue/${props.issue._id}`, data);
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
                  </div>
                )}

                {userInfo && (
                  <div>
                    <Divider />
                    <MenuItem onClick={handleCardDelete}>
                      <ListItemIcon>
                        <CloseIcon fontSize="small" color="error" />
                      </ListItemIcon>
                      <ListItemText>Delete</ListItemText>
                    </MenuItem>
                  </div>
                )}
              </Menu>
            </Grid>
            <Grid item lg="11">
              <Box component="span" sx={{ pr: 1 }}>
                <Chip
                  size="small"
                  color={getStatusColor(issue.status)}
                  label={toTitleCase(issue.status)}
                />
              </Box>
              <Box component="span" sx={{ pr: 1 }}>
                <Chip
                  size="small"
                  color={getTypeColor(issue.type)}
                  label={toTitleCase(issue.type)}
                />
              </Box>
              <Box component="span" sx={{ pr: 1 }}>
                <Chip
                  size="small"
                  color={getPriorityColor(issue.priority)}
                  label={toTitleCase(`${issue.priority} Priority`)}
                />
              </Box>
            </Grid>

            {params.issueId && (
              <Grid container alignItems="flex-start">
                <Grid item lg="12" sx={{ mt: 5, ml: 2 }}>
                  <Typography variant="h5">Description</Typography>
                </Grid>
                <Grid item lg="12" sx={{ m: 1 }}>
                  <Divider />
                </Grid>
                <Grid item lg="12" sx={{ mt: 0, ml: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    {issue.description}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
      <Dialog
        fullWidth
        maxWidth={"lg"}
        open={toggleModlogs}
        onClose={handleModlogsToggle}
      >
        <DialogTitle>
          {modlogs && modlogs.modlogs.title ? modlogs.modlogs.title : ""}
        </DialogTitle>
        <DialogContent>
          <DialogContentText component="pre">
            {modlogs && modlogs.modlogs.body ? modlogs.modlogs.body : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModlogsToggle}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        maxWidth={"lg"}
        open={toggleAttachments}
        onClose={handleAttachmentsToggle}
      >
        <DialogTitle>Attachments</DialogTitle>
        <DialogContent>
          <Box>
            <div
              dangerouslySetInnerHTML={{
                __html: issue.attachments.embed_source,
              }}
            />
            <Button
              onClick={() =>
                window.open(issue.attachments.generalUrl, "_blank")
              }
            >
              Go to URL
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAttachmentsToggle}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
