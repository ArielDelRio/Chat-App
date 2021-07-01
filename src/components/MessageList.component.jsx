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
    margin: "auto 4vw",
  },
  usersMsg: {
    display: "flex",
    justifyContent: "flex-start",
    paddingRight: "20px",
    borderRadius: "1.2rem 1.2rem 1.2rem 0",
  },
  myMsg: {
    display: "flex",
    justifyContent: "flex-end",
    paddingLeft: "20px",
    borderRadius: "1.2rem 1.2rem 0 1.2rem",
  },
  msg: {
    borderRadius: "inherit",
    maxWidth: 562,
    fontSize: "1.3rem",
    overflowWrap: "break-word",
    [theme.breakpoints.down("sm")]: {
      maxWidth: 345,
      fontSize: "1rem",
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

  const myRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0 && myRef.current)
      window.scrollTo(0, myRef.current.offsetTop);
  }, [messages]);

  return (
    <div className={classes.container}>
      {messages.map((message, index) => {
        const isUserMsg = message.senderId === user.id;
        return (
          <Box pb={0.5} key={index}>
            <Box
              className={
                isUserMsg
                  ? `${classes.myMsg} animate__animated animate__zoomIn animate__faster`
                  : `${classes.usersMsg} animate__animated animate__fadeInLeft animate__faster`
              }
            >
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
                  <p>{message.text}</p>
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
