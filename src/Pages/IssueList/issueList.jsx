import React, { useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { UserContext, IssuesContext, CategoriesContext } from "../../Context";

import { toTitleCase } from "../../Utils";
import { IssueCard } from "../../Items/Cards/issueCard";

import { Typography, Grid, Switch, Chip, Divider } from "@mui/material";
import ProjectMemberAlert from "../../Components/ProjectMemberAlert";
import { IssueListColumn } from "./issueListColumn";
import Loading from "../../Components/Loading";

export const IssueCardList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const archived = Boolean(searchParams.get("archived") === "true");
  const userInfo = useContext(UserContext);
  const { issues, issuesLoading } = useContext(IssuesContext);
  const categories = useContext(CategoriesContext);
  const params = useParams();

  const getNumOfArchived = () => {
    if (issues) {
      let numOfArchived = issues.filter((el) => el.archived === true).length;

      if (numOfArchived) {
        return numOfArchived;
      } else {
        return 0;
      }
    }
  };

  if (
    !userInfo?.user.projects[0] ||
    userInfo?.user.projects[0].id !== "63fe47296edfc3b387628861"
  ) {
    return <ProjectMemberAlert />;
  }

  if (issuesLoading || categories === undefined) {
    return <Loading />;
  }

  if (issues.length === 0 && !issuesLoading) {
    return (
      <Grid container justifyContent="center">
        <Grid item>
          <Typography variant="h2">No issues found!</Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <div>
      <Typography variant="h3" textAlign="center">
        {toTitleCase(params.category)}
      </Typography>
      <Grid container>
        <Typography sx={{ mr: 1 }}>
          <Switch
            onChange={() => {
              if (archived) {
                searchParams.set("archived", "false");
                setSearchParams(searchParams);
              } else {
                searchParams.set("archived", "true");
                setSearchParams(searchParams);
              }
            }}
            checked={archived}
            name="Archived"
          />
          Archived
        </Typography>
        <Chip
          sx={{ mt: 0.7 }}
          size="small"
          label={getNumOfArchived()}
          color="primary"
        />
        {/* <Typography sx={{ mr: 1 }}>
          <Switch
            onChange={(e) => {
              if (!sorted) {
                searchParams.set("type", "true");
                setSearchParams(searchParams);
              } else if (sorted) {
                searchParams.delete("type");
                setSearchParams(searchParams);
              }
            }}
            control={<Switch />}
            checked={sorted}
            name="Sort By Type"
          />
          Filter By Type
        </Typography> */}
      </Grid>
      <Divider sx={{ mt: 1, mb: 1 }} />

      {!archived && (
        <Grid container spacing={3}>
          <Grid item lg={3}>
            <IssueListColumn name="reported" />
          </Grid>

          <Grid item lg={3}>
            <IssueListColumn name="in-progress" />
          </Grid>

          <Grid item lg={3}>
            <IssueListColumn name="completed" />
          </Grid>

          <Grid item lg={3}>
            <IssueListColumn name="won't-fix" />
          </Grid>
        </Grid>
      )}

      {archived && (
        <div>
          <Grid container spacing={2}>
            {issues
              .filter((el) => archived === el.archived)
              .map((el, index) => {
                return (
                  <Grid item md={3} key={`${index}-${JSON.stringify(el._id)}`}>
                    <IssueCard issue={el} />
                  </Grid>
                );
              })}
          </Grid>
        </div>
      )}
    </div>
  );
};
