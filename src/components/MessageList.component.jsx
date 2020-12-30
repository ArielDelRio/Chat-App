import React from "react";

const MessageList = ({ messages, members, user }) => {
  return (
    <div>
      <ul>
        {messages.map((message, index) => {
          return (
            <li key={index}>
              <div>
                <span>
                  {message.senderId === user.id
                    ? "Me"
                    : members[message.senderId].name}
                </span>
                <p>{message.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MessageList;
