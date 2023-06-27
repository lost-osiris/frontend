import React, { useContext } from "react";
import { UserContext } from "../../context";
import { Grid, Alert, AlertTitle, IconButton } from "@mui/material/";
import axios from "axios";

import RefreshIcon from "@mui/icons-material/Refresh";

export const JoinWaitlist = () => {
  const userInfo = useContext(UserContext);
  const joinList = (e, waitlistInfo) => {
    e.preventDefault();
    console.log(waitlistInfo);
    axios
      .post("/api/project/Pale-Court/members/joinwaitlist", waitlistInfo)
      .then((res) => {
        console.log(res.data);
      });
  };
  return (
    <div>
      <Alert severity="info">
        <AlertTitle>Request Project Access</AlertTitle>
        If you wish to contribute to the project, you will have to join the
        waitlist, upon requesting access, an admin will have to verify your
        entry —{" "}
        <strong>
          Please click{" "}
          <a
            onClick={(e) =>
              joinList(e, {
                discord_id: userInfo.data.discord_id,
                name: userInfo.data.username,
              })
            }
            href="/"
          >
            here{" "}
          </a>
          to join the waitlist
        </strong>
        <br></br>
        <Grid container>
          <h3>
            If you believe you already have access to the project, try
            navigating home
          </h3>

          <IconButton
            onClick={() => (window.location.href = "/")}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
        </Grid>
      </Alert>
    </div>
  );
};
