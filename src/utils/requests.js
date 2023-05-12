import axios from "axios";

export const requests = async (method, url, options) => {
  if (!options) {
    options = {};
  }

  if (!options.headers) {
    options.headers = {};
  }

  if (!options.data) {
    options.data = {};
  }

  return axios({
    headers: {
      // TODO add authorization header
      ...options.headers,
    },
    data: options.data,
    method: method,
    url: url,
  }).then((res) => res.data);
};
