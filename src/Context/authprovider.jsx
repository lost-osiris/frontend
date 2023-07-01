import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import * as utils from "../Utils";

const currentDatetime = new Date();

export const UserContext = createContext({});

export const UserProvider = (props) => {
  const [tokenInfo, setTokenInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  if (tokenInfo) {
    if (new Date(tokenInfo.expireDate) < currentDatetime) {
      console.log("current is past the token, resetting and logging user out");
      localStorage.removeItem("userInfo");
      setTokenInfo({});
      navigate("/project/63fe47296edfc3b387628861/issues/general");
    }
  } else if (!tokenInfo && localStorage.getItem("userInfo")) {
    setTokenInfo(JSON.parse(localStorage.getItem("userInfo")));
  }

  let code = searchParams.get("code");

  if (code) {
    utils.requests("post", `/api/user/discord/${code}`).then((data) => {
      const newDatetime = new Date(
        currentDatetime.getTime() + 12 * 60 * 60 * 1000
      );
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ data: data, expireDate: newDatetime })
      );
      setTokenInfo({ data: data, expireDate: newDatetime });
      navigate("/project/63fe47296edfc3b387628861/issues/general");
    });
  }

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      let localstorage = JSON.parse(localStorage.getItem("userInfo"));
      utils
        .requests("get", `/api/user/${localstorage.data["discord_id"]}`)
        .then((data) => {
          // TODO update just the projects in userInfo local storage
          let jwt = localstorage.data.token;
          localstorage.data = data;
          localstorage.data.token = jwt;
          localStorage.setItem("userInfo", JSON.stringify(localstorage));
        })
        .catch(() => {
          localStorage.removeItem("userInfo");
        });
    }
  }, []);

  return (
    <UserContext.Provider value={tokenInfo}>
      {props.children}
    </UserContext.Provider>
  );
};
