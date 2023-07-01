import React from "react";

import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

export const HighPriorityIcon = () => {
  return (
    <DoubleArrowIcon
      color="error"
      sx={{ transform: "rotate(-90deg)", pl: 0, ml: 0.3 }}
    />
  );
};
