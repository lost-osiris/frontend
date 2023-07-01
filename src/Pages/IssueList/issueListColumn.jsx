import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import { IssuesContext } from "../../Context";
import { IssueCard } from "../../Items/Cards/issueCard";
import { toTitleCase, getStatusColorHk, getStatusColor } from "../../Utils";
import { Typography, Grid, Divider } from "@mui/material";

export const IssueListColumn = ({ name }) => {
  const { issues, updateIssue, deleteIssue } = useContext(IssuesContext);
  const filteredIssues = issues.filter((issue) => issue.status === name);

  const [{ canDrop }, drop] = useDrop({
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
            // bgcolor: getStatusColor(name) + ".dark",
            // borderColor: getStatusColor(name) + ".dark",
            bgcolor: getStatusColorHk(name),
            borderColor: getStatusColorHk(name),
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
        {filteredIssues
          .filter((value) => !value.archived)
          .map((el, index) => {
            return (
              <Grid item key={`${index}-${JSON.stringify(el)}`} sx={{ pb: 1 }}>
                <IssueCard issue={el} onDelete={() => deleteIssue(el)} />
              </Grid>
            );
          })}
      </Grid>
    </Grid>
  );
};
