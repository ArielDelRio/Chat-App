import { Avatar, Box, Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  message: {},
  usersMsg: {
    display: "flex",
    justifyContent: "flex-start",
  },
  myMsg: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

const MessageList = ({ messages, members, user }) => {
  const classes = useStyles();
  console.log(user, messages, members);
  return (
    <div>
      {messages.map((message, index) => {
        return (
          <Box pb={0.5} key={index}>
            {message.senderId === user.id ? (
              <Box className={classes.myMsg}>
                <Chip
                  variant="outlined"
                  component=""
                  label={message.text}
                  clickable
                />
              </Box>
            ) : (
              <Box className={classes.usersMsg}>
                <Chip
                  className={classes.usersMsg}
                  variant="outlined"
                  avatar={
                    <Avatar
                      src={
                        members[message.senderId] &&
                        members[message.senderId].imageUrl
                      }
                    />
                  }
                  label={message.text}
                  clickable
                />
              </Box>
            )}
          </Box>
        );
      })}
    </div>
  );
};

export default MessageList;
