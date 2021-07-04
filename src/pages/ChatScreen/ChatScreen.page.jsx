import React, { useEffect, useState } from "react";
import clsx from "clsx";

import Header from "../../components/Header.component";
import Info from "../../components/Info.component";
import MessageList from "../../components/MessageList.component";
import useStyles from "../ChatScreen/ChatScreen.style";
import SendMessageForm from "../../components/SendMessageForm.component";
import { Box, Chip } from "@material-ui/core";
import { getPrivateChannelName } from "../../utils";
import axios from "axios";

const ChatScreen = ({ title, pusher, channel, handleLogout }) => {
  const classes = useStyles();

  const [openInfo, setOpenInfo] = useState({ open: false, message: "" });

  const [chatInfo, setchatInfo] = useState({
    user: channel.members.me,
    mainChannel: {
      channel,
      members: channel.members.members,
      messages: [],
    },
    channels: [
      {
        channel,
        members: channel.members.members,
        messages: [],
      },
    ],
    indexChannelSelected: 0,
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

  const event_get_message = (event_data) => {
    const newMessage = {
      senderId: event_data.senderId,
      message_id: event_data.message_id,
      text: event_data.text,
      status: "DELIVERED",
    };

    const indexChannelToGetMessage = chatInfo.channels.findIndex((channel) => {
      return channel.channel.name === event_data.channel_name;
    });

    const channelSelected = chatInfo.channels[indexChannelToGetMessage];

    setchatInfo((chatInfo) => {
      if (event_data.senderId !== chatInfo.user.id) {
        if (indexChannelToGetMessage === chatInfo.indexChannelSelected) {
          channelSelected.messages.forEach(
            (message) => (message.status = "VIEWED")
          );
          newMessage.status = "VIEWED";

          channel.trigger("client-message-viewed", {
            id: chatInfo.user.id,
            channelName: channelSelected.channel.name,
          });
        }

        channelSelected.messages = [...channelSelected.messages, newMessage];
      } else {
        channelSelected.messages[channelSelected.messages.length - 1].status =
          "DELIVERED";
      }

      return { ...chatInfo };
    });
  };

  const event_message_viewed_event = (event_data) => {
    const userIdViewMessages = event_data.id;
    const channelNameFromEvent = event_data.channelName;

    setchatInfo((chatInfo) => {
      const indexChannelToGetMessage = chatInfo.channels.findIndex(
        (channel) => {
          return channel.channel.name === channelNameFromEvent;
        }
      );

      const channelSelected = chatInfo.channels[indexChannelToGetMessage];

      channelSelected.messages
        .filter((message) => message.senderId !== userIdViewMessages)
        .forEach((message) => (message.status = "VIEWED"));
      return { ...chatInfo };
    });
  };

  const event_typing_event = (event_data) => {
    const userId = event_data.id;
    const channelNameFromEvent = event_data.channelName;

    setchatInfo((chatInfo) => {
      const members = {
        ...chatInfo.channels[chatInfo.indexChannelSelected].members,
      };
      if (
        chatInfo.channels[chatInfo.indexChannelSelected].channel.name ===
        channelNameFromEvent
      )
        members[userId].typing = true;
      return { ...chatInfo };
    });
  };

  const event_stop_typing_event = (event_data) => {
    const userId = event_data.id;
    const channelNameFromEvent = event_data.channelName;

    setchatInfo((chatInfo) => {
      const members = {
        ...chatInfo.channels[chatInfo.indexChannelSelected].members,
      };
      if (
        chatInfo.channels[chatInfo.indexChannelSelected].channel.name ===
        channelNameFromEvent
      )
        members[userId].typing = false;
      return { ...chatInfo };
    });
  };

  const event_pusher_member_added = (member) => {
    const newMember = { [member.id]: member.info };

    setOpenInfo({
      open: true,
      message: `User ${member.info.name} joined`,
    });

    setchatInfo((chatInfo) => {
      const presenceMainChannel = chatInfo.channels[0];

      presenceMainChannel.members = {
        ...presenceMainChannel.members,
        ...newMember,
      };

      return chatInfo;
    });
  };

  const event_pusher_member_removed = (member) => {
    setOpenInfo({
      open: true,
      message: `User ${member.info.name} left`,
    });

    setchatInfo((chatInfo) => {
      const presenceMainChannel = chatInfo.channels[0];

      const updatedMembers = { ...presenceMainChannel.members };

      delete updatedMembers[member.id];

      presenceMainChannel.members = updatedMembers;

      return chatInfo;
    });
  };

  const event_client_accept_private_channels = (data) => {
    const privateChannelName = getPrivateChannelName(
      chatInfo.user.id,
      data.user_id
    );

    subscribeToPrivateChannel(privateChannelName);
  };

  const handleDrawerItemClick = (itemData) => {
    // click on self user
    if (itemData.user_id === chatInfo.user.id) return;

    // click on presence-main channel
    if (!itemData.user_id) {
      if (chatInfo.indexChannelSelected !== 0) {
        channel.trigger("client-message-viewed", {
          id: chatInfo.user.id,
          channelName: chatInfo.channels[0].channel.name,
        });
        setchatInfo((chatInfo) => {
          chatInfo.channels[0].messages
            .filter((message) => message.senderId !== chatInfo.user.id)
            .forEach((message) => (message.status = "VIEWED"));
          chatInfo.indexChannelSelected = 0;
          return { ...chatInfo };
        });
      }
      return;
    }

    const privateChannelName = getPrivateChannelName(
      chatInfo.user.id,
      itemData.user_id
    );

    // click on channel Selected
    if (
      chatInfo.channels[chatInfo.indexChannelSelected].channel.name ===
      privateChannelName
    )
      return;

    const indexExistChannel = chatInfo.channels.findIndex(
      (channel) => channel.channel.name === privateChannelName
    );

    if (indexExistChannel >= 0) {
      channel.trigger("client-message-viewed", {
        id: chatInfo.user.id,
        channelName: privateChannelName,
      });

      setchatInfo((chatInfo) => {
        chatInfo.channels[indexExistChannel].messages
          .filter((message) => message.senderId !== chatInfo.user.id)
          .forEach((message) => (message.status = "VIEWED"));

        return {
          ...chatInfo,
          indexChannelSelected: indexExistChannel,
        };
      });
    } else {
      //create channel
      //send invitation to join in a private chanel
      channel.trigger("client-accept-private-channels", {
        user_id: chatInfo.user.id,
      });

      subscribeToPrivateChannel(privateChannelName, true);
    }
  };

  const subscribeToPrivateChannel = (privateChannelName, isFromLocal) => {
    const newPrivateChannel = pusher.subscribe(privateChannelName);

    newPrivateChannel.bind("pusher:subscription_succeeded", () => {
      // if channel created set channel selected to the user who create the channel
      // the user who retrive the conexion for new channel keep the channelSelected

      const indexChannelSelected = isFromLocal
        ? chatInfo.channels.length
        : chatInfo.indexChannelSelected;

      setchatInfo({
        ...chatInfo,
        indexChannelSelected: indexChannelSelected,
        channels: [
          ...chatInfo.channels,
          {
            channel: newPrivateChannel,
            messages: [],
            members: newPrivateChannel.members.members,
          },
        ],
      });
    });

    newPrivateChannel.bind("pusher:subscription_error", (error) => error);
  };

  const addNewMessage = (senderId, message, channelName) => {
    const newMessage = {
      senderId: senderId,
      text: message,
      channel_name: channelName,
      status: "SENDING",
    };

    const channelSelected = chatInfo.channels[chatInfo.indexChannelSelected];

    axios
      .post("./send-message", newMessage)
      .then((res) => {})
      .catch((err) => {});

    setchatInfo((chatInfo) => {
      channelSelected.messages = [...channelSelected.messages, newMessage];
      return { ...chatInfo };
    });
  };

  useEffect(() => {
    // bind_global_event();

    const events = [
      { name: "pusher:member_added", func: event_pusher_member_added },
      { name: "pusher:member_removed", func: event_pusher_member_removed },
      {
        name: "client-accept-private-channels",
        func: event_client_accept_private_channels,
      },
    ];

    events.forEach((event) => {
      channel.bind(event.name, (event_data) => event.func(event_data));
    });
  }, []);

  useEffect(() => {
    const events = [
      { name: "get-message", func: event_get_message },
      { name: "client-typing", func: event_typing_event },
      { name: "client-stop-typing", func: event_stop_typing_event },
      { name: "client-message-viewed", func: event_message_viewed_event },
    ];

    events.forEach((event) => {
      chatInfo.channels[chatInfo.channels.length - 1].channel.bind(
        event.name,
        (event_data) => event.func(event_data)
      );
    });
  }, [chatInfo.channels.length]);

  console.log(chatInfo.channels);
  return (
    <React.Fragment>
      <Header
        title={title}
        handleLogout={handleLogout}
        user={chatInfo.user}
        drawerItems={chatInfo.channels}
        indexChannelSelected={chatInfo.indexChannelSelected}
        handleDrawerItemClick={(e) => handleDrawerItemClick(e)}
        handleDrawerToggle={handleDrawerToggle}
        isDrawerOpen={isDrawerOpen}
      />

      <Box
        className={clsx(classes.content, {
          [classes.contentShift]: isDrawerOpen,
        })}
      >
        <div>
          <Info
            message={openInfo.message}
            open={openInfo.open}
            setOpenInfo={setOpenInfo}
          />

          <Box className={classes.typingNotificaton}>
            {Object.values(
              chatInfo.channels[chatInfo.indexChannelSelected].members
            ).map((member) =>
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
            messages={chatInfo.channels[chatInfo.indexChannelSelected].messages}
            members={chatInfo.channels[chatInfo.indexChannelSelected].members}
            user={chatInfo.user}
          />

          <SendMessageForm
            user={chatInfo.user}
            channel={chatInfo.channels[chatInfo.indexChannelSelected].channel}
            isDrawerOpen={isDrawerOpen}
            addNewMessage={addNewMessage}
          />
        </div>
      </Box>
    </React.Fragment>
  );
};

export default ChatScreen;
