import React, { useState, useEffect } from "react";
import { ProjectCard } from "../../Items/Cards/projectCard";
import * as utils from "../../Utils";
import Loading from "../../Components/Loading";

import { Grid } from "@mui/material";

export const ProjectCardList = () => {
  let [projects, setProjects] = useState(null);

  useEffect(() => {
    if (projects === null) {
      utils.requests("get", `/api/projects`).then((data) => setProjects(data));
    }
  });

  if (!projects) {
    return <Loading />;
  }

  return (
    <div>
      <Grid container spacing={3}>
        {projects.map((el, index) => {
          return (
            <Grid item md={4} key={`${index}-${JSON.stringify(el)}`}>
              <ProjectCard project={el} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};
