import axios from "axios";
import React, { useEffect, useState } from "react";
import MessageList from "./MessageList.component";

const ChatScreen = ({ channel }) => {
  // console.log(channel);

  const [messages, setmessages] = useState([]);
  const [chatInfo, setchatInfo] = useState({
    user: channel.members.me,
    members: Object.values(channel.members.members),
    count: channel.members.count,
  });

  useEffect(() => {
    // axios
    //   .post(
    //     "http://localhost:3001/send-message",
    //     JSON.stringify({
    //       senderId: chatInfo.user.id,
    //       text: `Hello from ${chatInfo.user.info.name}`,
    //     })
    //   )
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    channel.bind_global((eventname, data) => {
      console.log(`Event name: ${eventname}`);
      console.log(`Event data: ${data}`);
    });

    //recive message
    // channel.bind("client-msg", function (data, metadata) {
    //   console.log(
    //     "I received",
    //     data,
    //     "from user",
    //     metadata.user_id,
    //     "with user info",
    //     channel.members.get(metadata.user_id).info
    //   );
    // });

    //some bind recive all messages
    //and update messages list

    channel.bind("get-message", (data) => {
      const message = data;
      setmessages([...messages, message]);
    });

    channel.bind("pusher:member_added", function (member) {
      console.log("member_added");
      const memberInfo = member.info;
      setchatInfo({
        ...chatInfo,
        members: [...chatInfo.members, memberInfo],
      });
    });
  }, []);

  return (
    <div>
      <h1>ChatScreen</h1>
      <h4>Hello {chatInfo.user.info.name}</h4>
      <div>Count users online :{chatInfo.count}</div>
      <div>
        Members:
        {chatInfo.members.map((member) => (
          <li key={member.user_id}>{member.name}</li>
        ))}
      </div>

      <MessageList messages={messages} />
    </div>
  );
};

export default ChatScreen;
