import React, { useState, useEffect, useContext } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useDrop } from "react-dnd";
import axios from "axios";

import { IssueCard } from "../../Items/Cards/issueCard";
import { toTitleCase } from "../../utils";
import { IssuesContext } from "../../context";

import {
  Typography,
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import { UserForm } from "../SubmissionForm/form.jsx";
import { IssueListColumn } from "./issueListColumn";

export const IssueCardList = () => {
  const { issues } = useContext(IssuesContext);
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const archived = Boolean(searchParams.get("archived") === "true");

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

  if (!issues) {
    return (
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
                  <Grid item md={4} key={`${index}-${JSON.stringify(el)}`}>
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