import React, { useRef, useEffect } from "react";
import { Box, Button } from "@mui/material";
import Message from "./Message";
import { IMessage } from "../../state/messages/reducer";
import { groupUserMessages } from "../../utils/messages";
import ForumIcon from "@mui/icons-material/Forum";
import Center from "../common/Center";
import { useRoom } from "../../state/messages/hooks";
import { useAppSelector } from "../../store";

const Messages: React.FC<{ messages: IMessage[] }> = ({ messages }) => {
  const { sendTextMsg } = useRoom();
  const currRoom = useAppSelector((state) => state.messages.currRoom);
  const ref = useRef<HTMLDivElement>(null);
  const groupedMessages = groupUserMessages(messages);

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
        mt: "2px",
        mb: "12px",
        "::-webkit-scrollbar": {
          display: "none",
        },
        scrollBehavior: "smooth",
        flexGrow: 1,
      }}
    >
      {messages.length === 0 ? (
        <Center>
          <ForumIcon sx={{ fontSize: "9rem", color: "grey.500" }} />
          <Button
            onClick={() => currRoom !== null && sendTextMsg(currRoom, "Hi 👋")}
            size="large"
            variant="text"
            sx={{ color: "grey.500" }}
          >
            Say hello 👋
          </Button>
        </Center>
      ) : (
        groupedMessages.map((message, idx) => (
          <Message message={message} key={idx} />
        ))
      )}
    </Box>
  );
};

export default Messages;
