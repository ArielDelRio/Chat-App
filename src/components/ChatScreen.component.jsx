import React, { useEffect, useState } from "react";

import MessageList from "./MessageList.component";
import SendMessageForm from "./SendMessageForm.component";

const ChatScreen = ({ channel }) => {
  const [chatInfo, setchatInfo] = useState({
    user: channel.members.me,
    members: channel.members.members,
    count: channel.members.count,
    messages: [],
  });

  useEffect(() => {
    //   // channel.bind_global((eventname, data) => {
    //   //   console.log(`Event name: ${eventname}`);
    //   //   console.log(`Event data: ${data}`);
    //   //   console.log(chatInfo);
    //   // });

    channel.bind("get-message", function (data) {
      console.log("message_added");
      const newMessage = { senderId: data.senderId, text: data.text };

      setchatInfo((chatInfo) => ({
        ...chatInfo,
        count: chatInfo.count,
        messages: [...chatInfo.messages, newMessage],
      }));
    });

    channel.bind("pusher:member_added", function (member) {
      console.log("member_added");

      const newMember = { [member.id]: member.info };

      setchatInfo((chatInfo) => ({
        ...chatInfo,
        count: chatInfo.count + 1,
        members: { ...chatInfo.members, ...newMember },
      }));
    });
  }, []);

  return (
    <div>
      <h1>ChatScreen</h1>
      <h4>Hello {chatInfo.user.info.name}</h4>
      <div>Count users online :{chatInfo.count}</div>
      <div>
        Members:
        {Object.values(chatInfo.members).map((member) => (
          <li key={member.user_id}>{member.name}</li>
        ))}
      </div>

      <MessageList messages={chatInfo.messages} members={chatInfo.members} />

      <SendMessageForm user={chatInfo.user} />
    </div>
  );
};

export default ChatScreen;
