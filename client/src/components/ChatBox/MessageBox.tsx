import React, { useState } from "react";
import { Stack, IconButton, Input } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import { useAppSelector } from "../../store";
import { useRoom } from "../../state/messages/hooks";

const MessageBox = () => {
  const [message, setMessage] = useState<string>("");
  const { sendTextMsg } = useRoom();
  const currRoom = useAppSelector((state) => state.messages.currRoom);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currRoom || !message) return;
    sendTextMsg(currRoom, message);
    setMessage("");
  };
  return (
    <form onSubmit={onSubmit}>
      <Stack
        direction="row"
        sx={{
          bgcolor: "grey.300",
          borderRadius: 20,
          padding: "8px",
          mb: "20px",
        }}
      >
        <IconButton sx={{ width: "50px", height: "50px" }}>
          <AttachFileIcon />
        </IconButton>

        <Input
          disableUnderline
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message.."
          sx={{
            py: "10px",
            flex: 1,
            ml: "10px",
            color: "grey.800",
            fontWeight: "500",
          }}
        />

        <IconButton sx={{ width: "50px", height: "50px" }}>
          <TagFacesIcon />
        </IconButton>

        <IconButton type="submit" sx={{ width: "50px", height: "50px" }}>
          <SendIcon />
        </IconButton>
      </Stack>
    </form>
  );
};

export default MessageBox;
