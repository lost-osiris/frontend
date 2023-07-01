import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import * as utils from "../Utils";

export const UserContext = createContext({});

export const UserProvider = (props) => {
  const [userInfo, setUserInfo] = useState();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let token = searchParams.get("token");

    if (token) {
      localStorage.setItem("jwt", token);
      navigate("/project/63fe47296edfc3b387628861/issues/general");
    } else {
      if (!userInfo && localStorage.getItem("jwt")) {
        setUserInfo(utils.parseJwt(localStorage.getItem("jwt")));
      }
    }
  }, [userInfo, searchParams]);

  return (
    <UserContext.Provider value={userInfo}>
      {props.children}
    </UserContext.Provider>
  );
};
