import React, { useContext } from "react";
import { UserContext } from "../../Context";
import { Grid, Alert, AlertTitle, IconButton } from "@mui/material/";
import * as utils from "../../Utils";

import RefreshIcon from "@mui/icons-material/Refresh";

export const JoinWaitlist = () => {
  const userInfo = useContext(UserContext);
  const joinList = (e) => {
    e.preventDefault();
    utils
      .requests(
        "post",
        "/api/project/63fe47296edfc3b387628861/members/joinwaitlist",
        userInfo.data
      )
      .then((data) => {
        console.log(data);
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
          <a onClick={(e) => joinList(e)} href="/">
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
