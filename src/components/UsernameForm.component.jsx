import React, { useState } from "react";

const UsernameForm = ({ onSubmit }) => {
  const [username, setusername] = useState("");
  const handleChange = (value) => {
    setusername(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username);
  };

  return (
    <div>
      <form onSubmitCapture={(e) => handleSubmit(e)}>
        <input
          type="text"
          placeholder="What is your username?"
          onChange={(e) => handleChange(e.target.value)}
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default UsernameForm;
