import React from "react";

const MessageList = ({ messages }) => {
  console.log(messages);
  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <div>
              <span>{message.senderId}</span>
              <p>{message.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
