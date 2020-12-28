import React, { useState } from "react";
import axios from "axios";

const SendMessageForm = ({ user }) => {
  const [message, setmessage] = useState("");

  const handleSendMessage = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/send-message", {
        senderId: user.id,
        text: message,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form onSubmit={(e) => handleSendMessage(e)}>
      <input
        type="text"
        name="message"
        onChange={(e) => setmessage(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default SendMessageForm;
