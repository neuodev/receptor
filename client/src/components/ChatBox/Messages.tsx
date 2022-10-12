import React from "react";
import { Box } from "@mui/material";
import Message from "./Message";

const Messages = () => {
  return (
    <Box>
      {messages.map((message, idx) => (
        <Message message={message} key={idx} />
      ))}
    </Box>
  );
};

export default Messages;

const messages = [
  {
    user: "Jone Doe",
    message:
      "Hey, Marshall! How are you? Can you please change the color theme of the website to pink and purple?",
  },
  {
    user: "Jane Doe",
    message:
      "Hey, Marshall! How are you? Can you please change the color theme of the website to pink and purple?",
  },
  {
    user: "Jone Doe",
    message:
      "Hey, Marshall! How are you? Can you please change the color theme of the website to pink and purple?",
  },
];
