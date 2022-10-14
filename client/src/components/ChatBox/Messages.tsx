import React from "react";
import { Box } from "@mui/material";
import Message from "./Message";
import { IMessage } from "../../state/messages/reducer";

const Messages: React.FC<{ messages: IMessage[] }> = ({ messages }) => {
  return (
    <Box>
      {messages.map((message) => (
        <Message message={message} key={message.id} />
      ))}
    </Box>
  );
};

export default Messages;
