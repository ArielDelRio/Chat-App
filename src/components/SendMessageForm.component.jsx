import React, { useEffect, useState } from "react";
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

const useStyles = makeStyles((theme) => ({
  form_control: {
    marginTop: "10px",
  },
  send_button: {
    marginBottom: "15px",
  },
}));

const SendMessageForm = ({ user, channel }) => {
  const classes = useStyles();
  const [message, setmessage] = useState("");
  const [isTyping, setisTyping] = useState(false);

  useEffect(() => {
    if (isTyping) {
      setTimeout(() => {
        channel.trigger("client-stop-typing", { id: user.id });
        setisTyping(false);
      }, 1000);
    }
  }, [isTyping]);

  const handleTypingMessage = (messageTyped) => {
    if (messageTyped.length > message.length && !isTyping) {
      channel.trigger("client-typing", { id: user.id });
      setisTyping(true);
    }
    setmessage(messageTyped);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    if (message.trim() === "") return;

    axios
      .post("http://localhost:3001/send-message", {
        senderId: user.id,
        text: message,
      })
      .then((res) => {
        setmessage("");
        setisTyping(false);
      })
      .catch((err) => {
        setmessage("");
        setisTyping(false);
        console.log(err);
      });
  };

  return (
    <form
      onSubmit={(e) => handleSendMessage(e)}
      noValidate
      autoComplete="off"
      className={classes.form_control}
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
