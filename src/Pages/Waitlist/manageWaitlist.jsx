import React, { useEffect, useState } from "react";
import * as utils from "../../Utils";

export const ManageWaitlist = () => {
  const [waitlist, setWaitlist] = useState();
  console.log(waitlist);

  const addToProject = (memberWithRole) => {
    utils
      .requests(
        "put",
        "/api/project/63fe47296edfc3b387628861/members/updatewaitlist",
        {
          data: memberWithRole,
          alert: true,
          alertMessage: "Successfully approved waitlist",
        }
      )
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        // Handle error
        console.table({
          status: error.response.status,
          message: error.message,
          data: error.response.data,
        });
      });
  };

  useEffect(() => {
    if (!waitlist) {
      utils
        .requests("get", "/api/project/63fe47296edfc3b387628861/waitlist")
        .then((data) => setWaitlist(data.waitlist));
    }
  }, [waitlist]);

  return (
    <div>
      {waitlist !== undefined && (
        <ul>
          {waitlist.map((member) => (
            <li key={member.discord_id}>
              {member.username}
              <button
                onClick={() =>
                  addToProject({
                    member,
                    role: "contributor",
                  })
                }
              >
                add as contributor
              </button>
              <button
                onClick={() =>
                  addToProject({
                    member,
                    role: "maintainer",
                  })
                }
              >
                add as maintainer
              </button>
              <button
                onClick={() =>
                  addToProject({
                    member,
                    role: "remove",
                  })
                }
              >
                delete from waitlist
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
