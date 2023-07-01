export { requests } from "./requests";
export { parseJwt } from "./jwt" 

const AUTH_REDIRECT =
  process.env.REACT_APP_IS_DEV === "true"
    ? encodeURI(
        "http://localhost:3000/api/auth/discord?redirect_uri=http://localhost:3000"
      )
    : encodeURI("https://modforge.gg/api/auth/discord");

export const AUTH_REDIRECT_URL = `https://discord.com/api/oauth2/authorize?client_id=1074939657902637058&redirect_uri=${AUTH_REDIRECT}&response_type=code&scope=identify`

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

export const getStatusColorHk = (status) => {
  switch (status) {
    case "reported":
      return "#ea6e48";
    case "in-progress":
      return "#eec96d";
    case "completed":
      return "#aea5a3";
    case "won't-fix":
      return "#2e212d";
    case "closed":
      return "#12152f";
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
