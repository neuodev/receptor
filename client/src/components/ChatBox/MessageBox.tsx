import React, { useRef, useState } from "react";
import { Box, Stack, IconButton, Input } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import { useAppSelector } from "../../store";
import { useRoom } from "../../state/messages/hooks";
import EmojiPicker from "emoji-picker-react";
import { useOutside } from "../../hooks/ui/useOutside";

const MessageBox = () => {
  const [message, setMessage] = useState<string>("");
  const currRoom = useAppSelector((state) => state.messages.currRoom);
  const { sendTextMsg } = useRoom();
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  useOutside(emojiRef, () => {
    setShowEmoji(false);
  });

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

        <Box
          sx={{
            position: "relative",
          }}
        >
          {showEmoji && (
            <Box
              sx={{ position: "absolute", bottom: 40, right: 40 }}
              ref={emojiRef}
            >
              <EmojiPicker
                onEmojiClick={({ emoji }) => {
                  setMessage(message + emoji);
                }}
              />
            </Box>
          )}
          <IconButton
            onClick={() => setShowEmoji(!showEmoji)}
            sx={{ width: "50px", height: "50px" }}
          >
            <TagFacesIcon />
          </IconButton>
        </Box>

        <IconButton type="submit" sx={{ width: "50px", height: "50px" }}>
          <SendIcon />
        </IconButton>
      </Stack>
    </form>
  );
};

export default MessageBox;
