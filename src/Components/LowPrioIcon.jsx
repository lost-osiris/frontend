import React from "react";

import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

export const LowPriorityIcon = () => {
  return (
    <DoubleArrowIcon
      color="info"
      sx={{ transform: "rotate(90deg)", pl: 0, ml: 0.3 }}
    />
  );
};
