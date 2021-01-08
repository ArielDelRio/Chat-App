import React, { useEffect, useState } from "react";
import clsx from "clsx";

import Header from "../../components/Header.component";
import Info from "../../components/Info.component";
import MessageList from "../../components/MessageList.component";
import useStyles from "../ChatScreen/ChatScreen.style";
import SendMessageForm from "../../components/SendMessageForm.component";
import { Box } from "@material-ui/core";

const ChatScreen = ({
  title,
  channel,
  handleLogout,
  handleDrawerItemClick,
}) => {
  const classes = useStyles();

  const [openInfo, setOpenInfo] = useState({ open: false, message: "" });

  const [chatInfo, setchatInfo] = useState({
    user: channel.members.me,
    members: channel.members.members,
    count: channel.members.count,
    messages: [],
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const handleDrawerToggle = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsDrawerOpen(!isDrawerOpen);
  };

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

    setOpenInfo({
      open: true,
      message: `User ${member.info.name} joined`,
    });
    setchatInfo((chatInfo) => ({
      ...chatInfo,
      count: chatInfo.count + 1,
      members: { ...chatInfo.members, ...newMember },
    }));
  };

  const event_pusher_member_removed = (member) => {
    console.log("member_removed");

    setOpenInfo({
      open: true,
      message: `User ${member.info.name} left`,
    });

    setchatInfo((chatInfo) => {
      const updatedMembers = { ...chatInfo.members };

      delete updatedMembers[member.id];

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

  console.log(chatInfo);
  return (
    <React.Fragment>
      <Header
        title={title}
        handleLogout={handleLogout}
        drawerItems={chatInfo.members}
        handleDrawerItemClick={handleDrawerItemClick}
        handleDrawerToggle={handleDrawerToggle}
        isDrawerOpen={isDrawerOpen}
      />

      <Box
        className={clsx(classes.content, {
          [classes.contentShift]: isDrawerOpen,
        })}
      >
        <Info
          message={openInfo.message}
          open={openInfo.open}
          setOpenInfo={setOpenInfo}
        />

        <MessageList
          messages={chatInfo.messages}
          members={chatInfo.members}
          user={chatInfo.user}
        />

        <SendMessageForm user={chatInfo.user} channel={channel} />
      </Box>
    </React.Fragment>
  );
};

export default ChatScreen;
