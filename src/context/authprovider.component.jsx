import React, { createContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const currentDatetime = new Date();

export const UserContext = createContext({});

export const UserProvider = (props) => {
  const [tokenInfo, setTokenInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || {}
  );
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  if (tokenInfo) {
    if (new Date(tokenInfo.expireDate) < currentDatetime) {
      console.log("current is past the token, resetting and logging user out");
      localStorage.removeItem("userInfo");
      setTokenInfo({});
      navigate("/");
    }
  } else if (!tokenInfo && localStorage.getItem("userInfo")) {
    setTokenInfo(JSON.parse(localStorage.getItem("userInfo")));
  }

  let code = searchParams.get("code");

  if (code) {
    axios.post(`/api/user/discord/${code}`).then((res) => {
      if (res.data) {
        const newDatetime = new Date(
          currentDatetime.getTime() + 12 * 60 * 60 * 1000
        );
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ data: res.data, expireDate: newDatetime })
        );
        setTokenInfo({ data: res.data, expireDate: newDatetime });
        navigate("/");
      }
    });
  }

  return (
    <UserContext.Provider value={tokenInfo.data}>
      {props.children}
    </UserContext.Provider>
  );
};
