export { requests } from "./requests";

export const toTitleCase = (str) => {
  return str.replace("-", " ").replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case "low":
      return "primary";
    case "medium":
      return "warning";
    case "high":
      return "error";
    default:
      return "default";
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "reported":
      return "info";
    case "in-progress":
      return "warning";
    case "completed":
      return "success";
    case "won't-fix":
      return "success";
    case "closed":
      return "success";
    default:
      return "default";
  }
};

export const getTypeColor = (type) => {
  switch (type) {
    case "bug":
      return "warning";
    case "suggestion":
      return "primary";
    case "feature-request":
      return "secondary";
    default:
      return "default";
  }
};

export const overflowLimiter = (text) => {
  if (text.length > 100) {
    text = text.substring(0, 100) + "...";
    return text;
  }
};
