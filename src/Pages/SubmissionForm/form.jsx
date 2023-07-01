import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Context/authprovider";
import * as utils from "../../Utils";
import { toTitleCase } from "../../Utils";

import {
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  MenuItem,
  Button,
  Stack,
  Grid,
  Alert,
  AlertTitle,
  CircularProgress,
  IconButton,
} from "@mui/material/";
import RadioGroup from "@mui/material/RadioGroup";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";

export const UserForm = (props) => {
  const userInfo = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [version, setVersion] = useState("");
  const [modlogsButtonColor, setModlogsButtonColor] = useState("primary");
  const [modlogsButtonText, setModlogsButtonText] = useState("Upload Modlogs");
  const [embedHelperValidation, setEmbedHelperValidation] = useState("");
  const [generalHelperValidation, setGeneralHelperValidation] = useState("");
  const [embedFieldColor, setEmbedFieldColor] = useState("primary");
  const [generalFieldColor, setgeneralFieldColor] = useState("primary");
  const [submitFormColor, setSubmitFormColor] = useState("primary");
  const [submitFormText, setSubmitFormText] = useState("Submit");
  const [newIssue, setNewIssue] = useState(
    props.issue || {
      status: "reported",
      summary: "",
      category: "General",
      type: "bug",
      priority: "medium",
      discord_id:
        !userInfo.user.discord_id || null ? "" : userInfo.user.discord_id,
      version: !version === undefined || null ? null : version,
      description: "",
      modlogs: {
        title: "",
        body: "",
      },
      archived: false,
      attachments: {
        embedSource: "",
        generalUrl: "",
      },
    }
  );

  const updateNewIssue = (field, value) => {
    if (field === "modlogs") {
      const reader = new FileReader();
      reader.readAsText(value);
      reader.onload = () => {
        setNewIssue({
          ...newIssue,
          modlogs: { title: value.name, body: reader.result },
        });
        setModlogsButtonColor("success");
        setModlogsButtonText("Success!");
      };
      reader.onerror = () => {
        console.log("file error", reader.error);
      };
    } else if (field === "attachmentsUrl") {
      setNewIssue({
        ...newIssue,
        attachments: { ...newIssue.attachments, generalUrl: value },
      });
    } else if (field === "attachmentsEmbedSource") {
      setNewIssue({
        ...newIssue,
        attachments: { ...newIssue.attachments, embedSource: value },
      });
    } else if (field === "version") {
      setNewIssue({
        ...newIssue,
        version: version,
      });
    } else {
      let issue = { ...newIssue };
      issue[field] = value;

      setNewIssue(issue);
    }
  };

  useEffect(() => {
    if (!version) {
      utils
        .requests("get", `/api/project/63fe47296edfc3b387628861`)
        .then((data) => setVersion(data.version));
    }
  }, [version]);

  useEffect(() => {
    if (!categories[0]) {
      utils
        .requests("get", `/api/project/63fe47296edfc3b387628861/categories`)
        .then((data) => setCategories(data));
    }
  }, [categories]);

  useEffect(() => {
    if (
      newIssue.attachments.generalUrl.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      )
    ) {
      setGeneralHelperValidation("Valid URL!");
      setgeneralFieldColor("success");
    } else {
      setGeneralHelperValidation("Please enter a valid URL");
      setgeneralFieldColor("warning");
    }

    if (newIssue.attachments.embedSource.includes("iframe")) {
      setEmbedHelperValidation("Valid Embed!");
      setEmbedFieldColor("success");
    } else {
      setEmbedHelperValidation("Please enter a valid embed link");
      setEmbedFieldColor("warning");
    }
  }, [newIssue, submitFormColor, submitFormText]);

  const handleFormSubmit = async () => {
    if (newIssue.summary !== "") {
      await utils
        .requests("post", `/api/issue/findexact`, newIssue)
        .then((data) => {
          if (data) {
            window.alert("this issue already exists");
          } else {
            try {
              let promise;
              let issue = {
                ...newIssue,
              };
              if (props.isUpdate) {
                let data = {
                  issue,
                  userInfo: userInfo.data,
                };
                promise = utils
                  .requests("put", `/api/issue/${props.issue._id}`, data)
                  .then(() => window.alert("issue updated!"));
              } else {
                promise = utils.requests("post", "/api/issue", issue);
              }
              promise.then(() => {
                if (!props.onSubmit) {
                  setNewIssue({
                    status: "reported",
                    summary: "",
                    category: "General",
                    type: "bug",
                    priority: "medium",
                    discord_id:
                      !userInfo.data.id || null ? "" : userInfo.data.id,
                    version: "",
                    description: "",
                    modlogs: {
                      title: "",
                      body: "",
                    },
                    archived: false,
                    attachments: {
                      embedSource: "",
                      generalUrl: "",
                    },
                  });
                  setSubmitFormColor("success");
                  setSubmitFormText("Success!");
                  setTimeout(() => {
                    setSubmitFormColor("primary");
                    setSubmitFormText("Submit");
                    setModlogsButtonColor("primary");
                    setModlogsButtonText("Upload Modlogs");
                  }, 500);
                } else {
                  props.onSubmit(newIssue);
                }
              });
            } catch (error) {
              console.log(error);
            }
          }
        });
    } else {
      window.alert("Please fill out all of the required fields!");
    }
  };

  return !userInfo ? (
    <div>
      <Alert severity="warning">
        <AlertTitle>Cannot Submit Form</AlertTitle>
        You cannot submit a form —{" "}
        <strong>
          Please login{" "}
          <a href="https://discord.com/api/oauth2/authorize?client_id=1074939657902637058&redirect_uri=https%3A%2F%2Fissue-tracker-front.vercel.app%2F&response_type=code&scope=identify">
            here{" "}
          </a>
          to be able to submit a form for this project
        </strong>
        <br></br>
        <Grid container>
          <h3>
            If you are already logged in and are still seeing this, try
            refreshing the page
          </h3>

          <IconButton onClick={() => window.location.reload()} color="primary">
            <RefreshIcon />
          </IconButton>
        </Grid>
      </Alert>
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
    </div>
  ) : (
    <div>
      <FormControl>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <TextField
              id="summary"
              label="Summary"
              placeholder="Summary"
              multiline
              required
              value={newIssue.summary}
              onChange={(e) => updateNewIssue("summary", e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item md={4}>
            <Grid container>
              <Grid item md={12}>
                <TextField
                  id="category-select"
                  label="Category"
                  required
                  value={newIssue.category}
                  select
                  fullWidth
                  sx={{ pb: 2 }}
                  onChange={(e) => updateNewIssue("category", e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem
                      key={toTitleCase(category)}
                      value={toTitleCase(category)}
                    >
                      {toTitleCase(category)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={12}>
                <TextField
                  required
                  disabled
                  id="player-name"
                  label="Player"
                  variant="standard"
                  value={userInfo.user.username}
                  onChange={(e) => updateNewIssue("playerName", e.target.value)}
                  sx={{ pb: 2 }}
                  fullWidth
                />
              </Grid>
              <Grid item md={12}>
                <TextField
                  id="version"
                  label="Version"
                  variant="standard"
                  value={version}
                  onChange={(e) => updateNewIssue("version", e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={2}>
            <FormLabel id="type-label-group">Type</FormLabel>
            <RadioGroup id="type-radio" sx={{ pb: 3 }}>
              <FormControlLabel
                label="Bug"
                checked={newIssue.type === "bug"}
                value="bug"
                control={
                  <Radio
                    onChange={(e) => updateNewIssue("type", e.target.value)}
                  />
                }
              />
              <FormControlLabel
                label="Suggestion"
                checked={newIssue.type === "suggestion"}
                value="suggestion"
                control={
                  <Radio
                    onChange={(e) => updateNewIssue("type", e.target.value)}
                  />
                }
              />
            </RadioGroup>
          </Grid>

          <Grid item md={2}>
            <FormLabel sx={{ pt: 3 }} id="priority-label-group">
              Priority
            </FormLabel>
            <RadioGroup id="priority-radio" sx={{ pb: 3 }}>
              <FormControlLabel
                label="Low Priority"
                checked={newIssue.priority === "low"}
                value="low"
                control={
                  <Radio
                    onChange={(e) => updateNewIssue("priority", e.target.value)}
                  />
                }
              />
              <FormControlLabel
                label="Medium Priority"
                checked={newIssue.priority === "medium"}
                value="medium"
                control={
                  <Radio
                    onChange={(e) => updateNewIssue("priority", e.target.value)}
                  />
                }
              />
              <FormControlLabel
                label="High Priority"
                checked={newIssue.priority === "high"}
                value="high"
                control={
                  <Radio
                    onChange={(e) => updateNewIssue("priority", e.target.value)}
                  />
                }
              />
            </RadioGroup>
          </Grid>

          <Grid item md={2}>
            <FormLabel sx={{ pt: 3 }} id="status-label-group">
              Status
            </FormLabel>
            <RadioGroup id="status-radio" sx={{ pb: 3 }}>
              <FormControlLabel
                value="reported"
                label="Reported"
                checked={newIssue.status === "reported"}
                control={
                  <Radio
                    onChange={(e) => updateNewIssue("status", e.target.value)}
                  />
                }
              />
              <FormControlLabel
                label="In Progress"
                checked={newIssue.status === "in-progress"}
                value="in-progress"
                control={
                  <Radio
                    onChange={(e) => updateNewIssue("status", e.target.value)}
                  />
                }
              />
              <FormControlLabel
                label="Completed"
                checked={newIssue.status === "completed"}
                value="completed"
                control={
                  <Radio
                    onChange={(e) => {
                      updateNewIssue("status", e.target.value);
                    }}
                  />
                }
              />
              <FormControlLabel
                label="Won't Fix"
                checked={newIssue.status === "won't-fix"}
                value="won't-fix"
                control={
                  <Radio
                    onChange={(e) => updateNewIssue("status", e.target.value)}
                  />
                }
              />
            </RadioGroup>
          </Grid>

          <Grid item md={12}>
            <TextField
              id="description"
              label="Description"
              placeholder="Description"
              multiline
              value={newIssue.description}
              onChange={(e) => updateNewIssue("description", e.target.value)}
              minRows={6}
              maxRows={20}
              fullWidth
              variant="filled"
            />
          </Grid>
          <Grid item md={6}>
            <Button
              color={modlogsButtonColor}
              variant="contained"
              component="label"
            >
              {modlogsButtonText}
              <input
                hidden
                accept="text/*"
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.size > 4 * 1024 * 1024) {
                    setModlogsButtonColor("error");
                    setModlogsButtonText("File size too large! ( > 4MB )");
                    setTimeout(() => {
                      setModlogsButtonColor("primary");
                      setModlogsButtonText("Upload Modlogs");
                    }, 5000);
                  } else {
                    updateNewIssue("modlogs", file);
                  }
                }}
              />
            </Button>
          </Grid>
          <Grid item md={6}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <FormLabel sx={{ pt: 3 }} id="attachments-group">
                  Attachments
                </FormLabel>
              </Grid>
              <Grid item md={6}>
                <TextField
                  color={embedFieldColor}
                  id="embed"
                  label="Embed"
                  placeholder="Embed"
                  // defaultValue={
                  //   newIssue && newIssue.attachments.embedSource
                  //     ? newIssue.attachments.embedSource
                  //     : "Embed"
                  // }
                  value={newIssue.attachments.embedSource}
                  onChange={(e) =>
                    updateNewIssue("attachmentsEmbedSource", e.target.value)
                  }
                  helperText={embedHelperValidation}
                  fullWidth
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  color={generalFieldColor}
                  id="generic"
                  label="URL"
                  placeholder="URL"
                  // defaultValue={
                  //   newIssue && newIssue.attachments.generalUrl
                  //     ? newIssue.attachments.generalUrl
                  //     : "Embed"
                  // }
                  value={newIssue.attachments.generalUrl}
                  onChange={(e) =>
                    updateNewIssue("attachmentsUrl", e.target.value)
                  }
                  helperText={generalHelperValidation}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Stack direction="row" spacing={2}>
              <Button
                color={submitFormColor}
                variant="contained"
                onClick={handleFormSubmit}
                endIcon={<SendIcon />}
              >
                {submitFormText}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </FormControl>
    </div>
  );
};
