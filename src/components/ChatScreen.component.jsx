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

  const bind_global_event = () => {
    channel.bind_global((eventname, data) => {
      console.log(`Event name: ${eventname}`);
      console.log(`Event data: ${data}`);
    });
  };

  const event_get_message = (event_data) => {
    console.log("message_added");

    setchatInfo((chatInfo) => ({
      ...chatInfo,
      count: chatInfo.count,
      messages: [
        ...chatInfo.messages,
        { senderId: event_data.senderId, text: event_data.text },
      ],
    }));
  };

  const event_typing_event = (event_data) => {
    console.log("start typing");
    setchatInfo((chatInfo) => {
      const members = { ...chatInfo.members };
      if (members[event_data]) members[event_data].typing = true;
      return { ...chatInfo, members };
    });
  };

  const event_stop_typing_event = (event_data) => {
    console.log("stop typing");
    setchatInfo((chatInfo) => {
      const members = { ...chatInfo.members };
      if (members[event_data]) members[event_data].typing = false;
      return { ...chatInfo, members };
    });
  };

  const event_pusher_member_added = (member) => {
    console.log("member_added");

    const newMember = { [member.id]: member.info };

    setchatInfo((chatInfo) => ({
      ...chatInfo,
      count: chatInfo.count + 1,
      members: { ...chatInfo.members, ...newMember },
    }));
  };

  const event_pusher_member_removed = (member) => {
    console.log("member_removed");
    setchatInfo((chatInfo) => {
      const updatedMembers = { ...chatInfo.members };

      // delete updatedMembers[member.id];
      updatedMembers[member.id].status = 0;
      return {
        ...chatInfo,
        count: chatInfo.count - 1,
        members: updatedMembers,
      };
    });
  };

  useEffect(() => {
    //bind_global_event();

    const events = [
      { name: "get-message", func: event_get_message },
      { name: "client-typing", func: event_typing_event },
      { name: "client-stop-typing", func: event_stop_typing_event },
      { name: "pusher:member_added", func: event_pusher_member_added },
      { name: "pusher:member_removed", func: event_pusher_member_removed },
    ];

    events.forEach((event) => {
      channel.bind(event.name, (event_data) => event.func(event_data));
    });
  }, []);

  console.log(chatInfo.members);
  return (
    <div>
      <h1>ChatScreen</h1>
      <h4>Hello {chatInfo.user.info.name}</h4>
      <div>Count users online :{chatInfo.count}</div>
      <div>
        Members:
        {Object.values(chatInfo.members).map((member) => (
          <li
            key={member.user_id}
            style={{ color: member.status ? "green" : "gray" }}
          >
            {member.name} {member.typing ? " is typing..." : ""}
          </li>
        ))}
      </div>

      <MessageList
        messages={chatInfo.messages}
        members={chatInfo.members}
        user={chatInfo.user}
      />

      <SendMessageForm user={chatInfo.user} channel={channel} />
    </div>
  );
};

export default ChatScreen;
