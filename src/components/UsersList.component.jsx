import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { Badge } from "@material-ui/core";
import ChatNewMessagesIcon from "@material-ui/icons/Chat";
import { getPrivateChannelName } from "../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "64ch",
    backgroundColor: theme.palette.background.paper,
    paddingTop: 0,
  },
  inline: {
    display: "inline",
  },
}));

const UsersList = ({
  listItems,
  user,
  indexChannelSelected,
  handleItemClick,
}) => {
  const classes = useStyles();

  const MainChannel = () => {
    const main_channel = listItems[0];
    const newMessagesCount = main_channel.messages.filter(
      (message) => message.status !== "VIEWED" && message.senderId !== user.id
    ).length;
    const lastMessage =
      main_channel.messages.length > 0
        ? main_channel.messages[main_channel.messages.length - 1].text
        : "";
    const isSelected =
      main_channel.channel.name ===
      listItems[indexChannelSelected].channel.name;

    return (
      <div onClick={handleItemClick}>
        <ListItem alignItems="flex-start" button selected={isSelected}>
          <ListItemAvatar>
            <Avatar alt={main_channel.name} src="logo2.png" variant="rounded" />
          </ListItemAvatar>
          <ListItemText
            primary="Chat-App"
            secondary={
              lastMessage.length > 15
                ? lastMessage.slice(0, 15) + "..."
                : lastMessage
            }
          />
          {newMessagesCount > 0 && (
            <Badge badgeContent={newMessagesCount} color="secondary">
              <ChatNewMessagesIcon />
            </Badge>
          )}
        </ListItem>
        <Divider component="li" />
      </div>
    );
  };

  const mainChannelMembers = listItems[0].members;

  return (
    <List className={classes.root}>
      <MainChannel />
      {Object.values(mainChannelMembers).map((member) => {
        const channelItem = listItems.find(
          (item) =>
            item.channel.name === getPrivateChannelName(user.id, member.user_id)
        );
        const newMessagesCount =
          channelItem &&
          channelItem.messages.filter(
            (message) =>
              message.status !== "VIEWED" && message.senderId !== user.id
          ).length;
        const lastMessage =
          channelItem && channelItem.messages.length > 0
            ? channelItem.messages[channelItem.messages.length - 1].text
            : "";
        const isSelected =
          channelItem &&
          channelItem.channel.name ===
            listItems[indexChannelSelected].channel.name;

        return (
          <div key={member.user_id} onClick={() => handleItemClick(member)}>
            <ListItem alignItems="flex-start" button selected={isSelected}>
              <ListItemAvatar>
                <Avatar alt={member.name} src={member.imageUrl} />
              </ListItemAvatar>
              <ListItemText
                primary={member.name}
                secondary={
                  lastMessage.length > 15
                    ? lastMessage.slice(0, 15) + "..."
                    : lastMessage
                }
              />
              {newMessagesCount > 0 && (
                <Badge badgeContent={newMessagesCount} color="secondary">
                  <ChatNewMessagesIcon />
                </Badge>
              )}
            </ListItem>
            <Divider component="li" />
          </div>
        );
      })}
    </List>
  );
};

export default UsersList;
