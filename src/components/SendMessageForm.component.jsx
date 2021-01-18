import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import {
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  form_control: {
    marginTop: "10px",
    position: "fixed",
    bottom: 0,
    right: 0,
    width: "100%",

    background: "white",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },


  send_button: {
    marginBottom: "15px",
  },
}));

const SendMessageForm = ({ user, channel, isDrawerOpen }) => {
  const classes = useStyles();
  const [message, setmessage] = useState("");
  const [isTyping, setisTyping] = useState(false);

  useEffect(() => {
    if (isTyping) {
      setTimeout(() => {
        channel.trigger("client-stop-typing", {
          id: user.id,
          channelName: channel.name,
        });
        setisTyping(false);
      }, 1000);
    }
  }, [isTyping]);

  const handleTypingMessage = (messageTyped) => {
    if (messageTyped.length > message.length && !isTyping) {
      channel.trigger("client-typing", {
        id: user.id,
        channelName: channel.name,
      });
      setisTyping(true);
    }
    setmessage(messageTyped);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    if (message.trim() === "") return;

    axios
      .post("./send-message", {
        senderId: user.id,
        text: message,
        channel_name: channel.name,
      })
      .then((res) => {
        setmessage("");
        setisTyping(false);
      })
      .catch((err) => {
        setmessage("");
        setisTyping(false);
      });
  };

  return (
    <form
      className={clsx(classes.form_control, {
        [classes.contentShift]: isDrawerOpen,
      })}
      onSubmit={(e) => handleSendMessage(e)}
      noValidate
      autoComplete="off"
      // className={classes.form_control}
    >
      <FormControl fullWidth variant="filled">
        <InputLabel htmlFor="message-input">Send a message</InputLabel>
        <FilledInput
          id="message-input"
          multiline
          color="primary"
          type="text"
          value={message}
          onChange={(e) => handleTypingMessage(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                className={classes.send_button}
                type="submit"
                edge="end"
              >
                <SendIcon></SendIcon>
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </form>
  );
};

export default SendMessageForm;
