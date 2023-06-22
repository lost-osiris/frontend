import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

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

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      let localstorage = JSON.parse(localStorage.getItem("userInfo"));
      axios.get(`/api/user/${localstorage.data["discord_id"]}`).then((res) => {
        // TODO update just the projects in userInfo local storage
        localstorage.data = res.data;
        localStorage.setItem("userInfo", JSON.stringify(localstorage));
      });
    }
  }, []);
  // const [tokenInfo, setTokenInfo] = useState(
  //   JSON.parse(localStorage.getItem("userInfo")) || {}
  // );
  // const navigate = useNavigate();
  // const [searchParams, setSearchParams] = useSearchParams();

  // useEffect(() => {
  //   if (
  //     tokenInfo.expireDate &&
  //     new Date(tokenInfo.expireDate) < currentDatetime
  //   ) {
  //     console.log("current is past the token, resetting and logging user out");
  //     localStorage.removeItem("userInfo");
  //     setTokenInfo({});
  //     navigate("/");
  //   }
  // }, [tokenInfo.expireDate, navigate]);

  // useEffect(() => {
  //   if (localStorage.getItem("userInfo")) {
  //     let localstorage = JSON.parse(localStorage.getItem("userInfo"));
  //     axios.get(`/api/user/${localstorage.data.id}/projects`).then((res) => {
  //       // TODO update just the projects in userInfo local storage
  //       // localStorage.setItem("userInfo", JSON.stringify(res.data));
  //     });
  //   }
  // }, []);

  // let code = searchParams.get("code");

  // useEffect(() => {
  //   if (code && !localStorage.getItem("userInfo")) {
  //     axios.post(`/api/user/discord/${code}`).then((res) => {
  //       if (res.data) {
  //         const newDatetime = new Date(
  //           currentDatetime.getTime() + 12 * 60 * 60 * 1000
  //         );
  //         localStorage.setItem(
  //           "userInfo",
  //           JSON.stringify({ data: res.data, expireDate: newDatetime })
  //         );
  //         setTokenInfo({ data: res.data, expireDate: newDatetime });
  //       }
  //     });
  //   }

  //   Promise.all([discordReq]).then(() => {
  //     axios
  //       .post(`/api/user/create`, localStorage.getItem("userAttributes"))
  //       .then(() => {
  //         let localstorage = JSON.parse(
  //           localStorage.getItem("userAttributes")
  //         );
  //         axios.get(`/api/user/${localstorage.data.id}`).then((res) => {
  //           localStorage.setItem("userProjects", JSON.stringify(res.data));
  //         });
  //       })
  //       .then(() => {
  //         navigate("/");
  //         setTokenInfo({
  //           attributes: JSON.parse(localStorage.getItem("userAttributes")),
  //           projects: JSON.parse(localStorage.getItem("userProjects")),
  //         });
  //       })
  //       .catch((error) => {
  //         console.error("Error creating user:", error);
  //       });
  //   });
  // }
  // }, [code, navigate, tokenInfo]);

  return (
    <UserContext.Provider value={tokenInfo}>
      {props.children}
    </UserContext.Provider>
  );
};
