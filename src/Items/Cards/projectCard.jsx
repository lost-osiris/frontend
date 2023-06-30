import React, { useState } from "react";

import { Card, CardContent, Grid, Box, Typography } from "@mui/material";

export const ProjectCard = ({ project }) => {
  return (
    <>
      <Card>
        <CardContent>
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
                  // onClick={() => navigate(`/issue/${issue._id}`)}
                >
                  <Typography>{project.name}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};
