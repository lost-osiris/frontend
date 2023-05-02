import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  Avatar,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  const [toggleModlogs, setToggleModlogs] = useState(false);
  const [modlogs, setModlogs] = useState("");
  const [toggleAttachments, setToggleAttachments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);

  const handleCardDelete = () => {
    let data = JSON.parse(localStorage.getItem(["userInfo"]));
    axios.delete(`/api/issue/${issue._id}`, { data: data }).then(() => {
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

  return (
    <>
      <Card>
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={2}>
            <Grid item lg="11">
              <Box
                component="h4"
                sx={{ ml: 1 }}
                onClick={() => navigate(`/issue/${issue._id}`)}
              >
                {issue.summary}
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
                <MenuItem onClick={handleModlogsToggle}>
                  <ListItemIcon>
                    <ArticleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>View Mod Logs</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleAttachmentsToggle}>
                  <ListItemIcon>
                    <AttachFileIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>View Attachment</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => props.toggleEdit(issue)}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <Grid container>
                  <Grid item md="3">
                    <Switch
                      size="small"
                      control={<Switch />}
                      checked={issue.archived}
                      label="Archived"
                      onChange={() => {
                        if (
                          issue.status === "completed" ||
                          issue.status === "won't-fix"
                        ) {
                          issue.archived = !issue.archived;
                          let data = {
                            issue,
                            userInfo: JSON.parse(
                              localStorage.getItem(["userInfo"])
                            ),
                          };
                          console.log(data);
                          axios.put(`/api/issue/${props.issue._id}`, data);
                        } else {
                          window.alert(
                            'Status must be "Completed" or "Won\'t Fix" in order to archive'
                          );
                        }
                      }}
                    />
                  </Grid>
                  <Grid item sx={{ pl: 0.5 }}>
                    <Typography>Archived</Typography>
                  </Grid>
                </Grid>

                <Divider />
                <MenuItem onClick={handleCardDelete}>
                  <ListItemIcon>
                    <CloseIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </Menu>
            </Grid>
            <Grid item md="11">
              <Box component="span" sx={{ pr: 1 }}>
                <Chip
                  color={getStatusColor(issue.status)}
                  label={toTitleCase(issue.status)}
                />
              </Box>
              <Box component="span" sx={{ pr: 1 }}>
                <Chip
                  color={getTypeColor(issue.type)}
                  label={toTitleCase(issue.type)}
                />
              </Box>
              <Box component="span" sx={{ pr: 1 }}>
                <Chip
                  color={getPriorityColor(issue.priority)}
                  label={toTitleCase(`${issue.priority} Priority`)}
                />
              </Box>
            </Grid>
            <Grid container alignItems="flex-start">
              <Grid item md="10" sx={{ mt: 2, ml: 5 }}>
                <Typography variant="body1" color="text.secondary">
                  {issue.description.length > 300
                    ? issue.description.slice(0, 300) + "..."
                    : issue.description}
                </Typography>
              </Grid>
              <Grid
                item
                md="1"
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <Avatar
                  onClick={() => navigate(`/user/${issue.playerData.id}`)}
                  src={`https://cdn.discordapp.com/avatars/${issue.playerData.id}/${issue.playerData.avatar}.png`}
                  alt={issue.playerData.name}
                />
              </Grid>
            </Grid>
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
