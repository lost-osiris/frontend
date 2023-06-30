import React, { useEffect, useState } from "react";
import axios from "axios";

export const ManageWaitlist = () => {
  const [waitlist, setWaitlist] = useState();

  const contributor = (member) => {
    axios
      .put(
        "/api/project/63fe47296edfc3b387628861/members/updatewaitlist",
        member
      )
      .then((res) => {
        console.log(res.data);
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
      axios
        .get("/api/project/63fe47296edfc3b387628861/waitlist")
        .then((res) => setWaitlist(res.data.waitlist));
    }
  }, [waitlist]);

  return (
    <div>
      {waitlist !== undefined && (
        <ul>
          {waitlist.map((member) => (
            <li key={member.discord_id}>
              {member.name}
              <button
                onClick={() =>
                  contributor({
                    discord_id: member.discord_id,
                    role: "contributor",
                  })
                }
              >
                add as contributor
              </button>
              <button>add as maintainer</button>
              <button>delete from waitlist</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
