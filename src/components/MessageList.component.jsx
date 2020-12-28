import React from "react";

const MessageList = ({ messages, members }) => {
  console.log(messages, members);
  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <div>
              <span>
                {/* {
                  members.find((member) => member.user_id === message.senderId)
                    .name
                } */}
                {members[message.senderId].name}
              </span>
              <p>{message.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
