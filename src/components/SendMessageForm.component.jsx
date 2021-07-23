import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { themes } from "../components/ThemeContext";

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  form_control: {
    // marginTop: "30px",
    position: "fixed",
    bottom: 0,
    right: 0,
    width: "100%",

    backgroundColor:
      theme === themes.light ? "rgba(255, 255, 255, 1)" : "rgba(0,0,0,1)",

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

const SendMessageForm = ({ user, channel, isDrawerOpen, addNewMessage }) => {
  const classes = useStyles();
  const [message, setmessage] = useState("");
  const [isTyping, setisTyping] = useState(false);

  const inputRef = React.useRef();

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

    addNewMessage(user.id, message, channel.name);

    setmessage("");
    setisTyping(false);

    inputRef.current.focus();
  };

  const handleKeyPress = (event) => {
    if (event.keyCode === 13 && event.altKey) {
      setmessage(message + "\n");
      return;
    }

    if (event.keyCode === 13) {
      handleSendMessage(event);
    }
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
          inputRef={inputRef}
          id="message-input"
          multiline
          color="primary"
          type="text"
          value={message}
          autoFocus
          onChange={(e) => handleTypingMessage(e.target.value)}
          onKeyDown={handleKeyPress}
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
