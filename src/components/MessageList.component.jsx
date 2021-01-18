import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useRef, useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: "5vh",
  },
  usersMsg: {
    display: "flex",
    justifyContent: "flex-start",
    paddingRight: "20px",
  },
  myMsg: {
    display: "flex",
    justifyContent: "flex-end",
    paddingLeft: "20px",
  },
  msg: {
    borderRadius: "1.2em",
    maxWidth: 562,
    overflowWrap: "break-word",
    [theme.breakpoints.down("sm")]: {
      maxWidth: 345,
    },
  },

  msgHeader: {
    padding: "10px 10px 0 10px",
  },
  msgContent: {
    padding: "10px",
    "&:last-child": {
      paddingBottom: "10px",
    },
  },
}));

const MessageList = ({ messages, members, user }) => {
  const classes = useStyles();

  const myRef = useRef(null)

  useEffect(() => {
    if(messages.length > 0 && myRef.current)
      window.scrollTo(0, myRef.current.offsetTop);
  }, [messages])

  return (
    <div className={classes.container}>
      {messages.map((message, index) => {
        const isUserMsg = message.senderId === user.id;
        return (
          <Box pb={0.5} key={index}>
            <Box className={isUserMsg ? classes.myMsg : classes.usersMsg}>
              <Card
                ref={myRef}
                elevation={3}
                variant="outlined"
                classes={{
                  root: classes.msg,
                }}
              >
                {!isUserMsg && (
                  <CardHeader
                    classes={{ root: classes.msgHeader }}
                    avatar={
                      <Avatar
                        className={classes.avatar}
                        src={
                          members[message.senderId] &&
                          members[message.senderId].imageUrl
                        }
                      ></Avatar>
                    }
                    title={
                      members[message.senderId] &&
                      members[message.senderId].name
                    }
                  />
                )}
                <CardContent classes={{ root: classes.msgContent }}>
                  <Typography variant="body2" color="textPrimary" component="p">
                    {message.text}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );
      })}
    </div>
  );
};

export default MessageList;
