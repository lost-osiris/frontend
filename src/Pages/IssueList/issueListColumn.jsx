import React, { useContext } from "react";
import { useDrop } from "react-dnd";

import { Typography, Grid, Divider } from "@mui/material";

import { IssueCard } from "../../Items/Cards/issueCard";
import { IssuesContext } from "../../context/issuesprovider";
import { toTitleCase, getStatusColor } from "../../utils";

export const IssueListColumn = ({ name }) => {
  const { issues, updateIssue } = useContext(IssuesContext);
  const filteredIssues = issues.filter((issue) => issue.status === name);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "issue",
    drop: (item) => updateIssue({ ...item.issue, status: name }),
    collect: (monitor) => {
      let item = monitor.getItem();
      let issue = item ? item.issue : {};
      let accept = issue.status !== name;

      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop() && accept,
      };
    },
  });

  return (
    <Grid container>
      <Grid item lg={12}>
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            borderRadius: "5px",
            opacity: 0.9,
            bgcolor: getStatusColor(name) + ".dark",
            borderColor: getStatusColor(name) + ".dark",
          }}
        >
          {name
            .split(" ")
            .map((s) => toTitleCase(s))
            .join(" ")}
        </Typography>
        <Divider sx={{ mt: 1, mb: 1 }} />
      </Grid>
      <Grid
        item
        lg={12}
        sx={{
          minHeight: "400px",
          maxHeight: "800px",
          p: 1,
          borderStyle: canDrop ? "dotted" : "",
          borderColor: canDrop ? getStatusColor(name) + ".light" : "",
          borderRadius: canDrop ? "10px" : "",
        }}
        ref={drop}
      >
        {filteredIssues.map((el, index) => {
          if (!el.archived) {
            return (
              <Grid item key={`${index}-${JSON.stringify(el)}`} sx={{ pb: 1 }}>
                <IssueCard issue={el} />
              </Grid>
            );
          }
        })}
      </Grid>
    </Grid>
  );
};
