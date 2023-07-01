import React from "react";

import { Chip } from "@mui/material";

export const CardChip = ({ label, color, img }) => {
  return (
    <Chip
      label={label}
      color={color}
      variant="outlined"
      avatar={img}
      sx={{ pl: 1 }}
    />
  );
};
