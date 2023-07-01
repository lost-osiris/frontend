import axios from "axios";
import { store, addAlert } from './store'
import * as utils from '../Utils'

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
  
  let jwt = localStorage.getItem("jwt");
  // console.log(utils.parseJwt(localstorage));

  // console.log(Date.now(), localstorage.expires)
  // if (Date.now() >= new Date(localstorage.expires)) {
  //   console.log("need to refresh token")
  // }

  return axios({
    headers: {
      // TODO add authorization header
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
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
  }).catch((error) => {
    if (error.response.status === 403) {
      store.dispatch(addAlert({type: "error", message: "Forbidden"}))
    }
  });

};
