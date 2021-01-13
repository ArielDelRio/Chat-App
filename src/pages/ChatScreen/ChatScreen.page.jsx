import React, { useEffect, useState } from "react";
import clsx from "clsx";

import Header from "../../components/Header.component";
import Info from "../../components/Info.component";
import MessageList from "../../components/MessageList.component";
import useStyles from "../ChatScreen/ChatScreen.style";
import SendMessageForm from "../../components/SendMessageForm.component";
import { Box, Chip } from "@material-ui/core";

const ChatScreen = ({
  title,
  channel,
  handleLogout,
  handleDrawerItemClick,
  privateChannels,
}) => {
  const classes = useStyles();

  const [openInfo, setOpenInfo] = useState({ open: false, message: "" });

  // const [chatInfo, setchatInfo] = useState({
  //   user: channel.members.me,
  //   members: channel.members.members,
  //   count: channel.members.count,
  //   messages: [],
  //   privateChats: privateChannels,
  //   channelSelected: channel,
  // });

  const [channelSelected2, setChannelSelected] = useState({
    user: channel.members.me,
    members: channel.members.members,
    count: channel.members.count,
    messages: [],
  });

  const [chatInfo, setchatInfo] = useState([
    {
      name: channel.name,
      user: channel.members.me,
      members: channel.members.members,
      count: channel.members.count,
      messages: [],
      selected: true,
    },
  ]);

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

    setChannelSelected((channelSelected) => ({
      ...channelSelected,
      count: channelSelected.count,
      messages: [
        ...channelSelected.messages,
        { senderId: event_data.senderId, text: event_data.text },
      ],
    }));
  };

  const event_typing_event = (event_data) => {
    console.log("start typing");
    const userId = event_data.id;

    setChannelSelected((channelSelected) => {
      const members = { ...channelSelected.members };
      if (members[userId]) members[userId].typing = true;
      return { ...channelSelected, members };
    });
  };

  const event_stop_typing_event = (event_data) => {
    console.log("stop typing");
    const userId = event_data.id;

    setChannelSelected((channelSelected) => {
      const members = { ...channelSelected.members };
      if (members[userId]) members[userId].typing = false;
      return { ...channelSelected, members };
    });
  };

  const event_pusher_member_added = (member) => {
    console.log("member_added");
    const newMember = { [member.id]: member.info };

    setOpenInfo({
      open: true,
      message: `User ${member.info.name} joined`,
    });

    setchatInfo((chatInfo) => {
      const presenceMainChannel = chatInfo.find(
        (channel) => channel.name === "presence-main"
      );

      presenceMainChannel.count = presenceMainChannel.count + 1;
      presenceMainChannel.members = {
        ...presenceMainChannel.members,
        ...newMember,
      };

      return chatInfo;
    });
  };

  const event_pusher_member_removed = (member) => {
    console.log("member_removed");

    setOpenInfo({
      open: true,
      message: `User ${member.info.name} left`,
    });

    setChannelSelected((channelSelected) => {
      const updatedMembers = { ...channelSelected.members };

      delete updatedMembers[member.id];

      return {
        ...channelSelected,
        count: channelSelected.count - 1,
        members: updatedMembers,
      };
    });
  };

  useEffect(() => {
    // bind_global_event();

    const events = [
      // { name: "get-message", func: event_get_message },
      // { name: "client-typing", func: event_typing_event },
      // { name: "client-stop-typing", func: event_stop_typing_event },
      { name: "pusher:member_added", func: event_pusher_member_added },
      // { name: "pusher:member_removed", func: event_pusher_member_removed },
    ];

    events.forEach((event) => {
      channel.bind(event.name, (event_data) => event.func(event_data));
    });
  }, []);

  useEffect(() => {
    console.log("private channel change");
  }, [privateChannels]);

  const channelSelected = chatInfo.find((chat) => chat.selected === true);

  console.log(chatInfo);
  return (
    <React.Fragment>
      <Header
        title={title}
        handleLogout={handleLogout}
        drawerItems={channelSelected.members}
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

        <Box display="flex" justifyContent="center" pb={2}>
          {Object.values(channelSelected.members).map((member) =>
            member.typing ? (
              <Chip
                key={member.user_id}
                color="primary"
                size="small"
                label={member.name + " is typing..."}
              />
            ) : null
          )}
        </Box>

        <MessageList
          messages={channelSelected.messages}
          members={channelSelected.members}
          user={channelSelected.user}
        />

        <SendMessageForm user={channelSelected.user} channel={channel} />
      </Box>
    </React.Fragment>
  );
};

export default ChatScreen;
