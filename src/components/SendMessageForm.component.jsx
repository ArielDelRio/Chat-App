import React, { useEffect, useState } from "react";
import axios from "axios";

const SendMessageForm = ({ user, channel }) => {
  const [message, setmessage] = useState("");
  const [isTyping, setisTyping] = useState(false);

  useEffect(() => {
    if (isTyping) {
      setTimeout(() => {
        channel.trigger("client-stop-typing", user.id);
        setisTyping(false);
      }, 1000);
    }
  }, [isTyping]);

  const handleTypingMessage = (messageTyped) => {
    if (messageTyped.length > message.length && !isTyping) {
      setisTyping(true);
      channel.trigger("client-typing", user.id);
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
    <form onSubmit={(e) => handleSendMessage(e)}>
      <input
        type="text"
        name="message"
        onChange={(e) => handleTypingMessage(e.target.value)}
        value={message}
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default SendMessageForm;
