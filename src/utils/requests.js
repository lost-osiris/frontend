import axios from "axios";
import { store, addAlert } from './store'

export const requests =  async (method, url, options) => {
  if (!options) {
    options = {};
  }

  if (!options.headers) {
    options.headers = {};
  }

  if (!options.data) {
    options.data = {};
  }
  
  let localstorage = JSON.parse(localStorage.getItem("userInfo"));

  return axios({
    headers: {
      // TODO add authorization header
      "Content-Type": "application/json",
      Authorization: `Bearer ${localstorage?.data.token.access_token}`,
      ...options.headers,
    },
    data: options.data,
    method: method,
    url: url,
  }).then((res) => {
    if (res.status >= 200 && options.alert) {
      store.dispatch(addAlert({type: "success", message: options.alertMessage || "Success"}))
    }

    return res.data
  });

};
