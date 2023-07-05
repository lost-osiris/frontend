import React, { useState } from "react";
import { Grow, Snackbar, Alert } from "@mui/material";

function TransitionLeft(props) {
  return <Grow {...props} direction="left" />;
}

export default function AlertNotification({ value }) {
  const [open, setOpen] = useState(true);

  return (
    <Snackbar
      sx={{ mt: 7, width: 500 }}
      TransitionComponent={TransitionLeft}
      open={open}
      onClose={() => setOpen(false)}
      autoHideDuration={value.duration || 3000}
      disableWindowBlurListener={true}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert severity={value.type} sx={{ width: "100%" }}>
        {value.message}
      </Alert>
    </Snackbar>
  );
}
