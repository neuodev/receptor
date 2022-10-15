import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import Message from "./Message";
import { IMessage } from "../../state/messages/reducer";

const Messages: React.FC<{ messages: IMessage[] }> = ({ messages }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);
  return (
    <Box
      ref={ref}
      sx={{
        overflowY: "auto",
        my: "2px",
        "::-webkit-scrollbar": {
          display: "none",
        },
        scrollBehavior: "smooth",
      }}
    >
      {messages.map((message) => (
        <Message message={message} key={message.id} />
      ))}
    </Box>
  );
};

export default Messages;
