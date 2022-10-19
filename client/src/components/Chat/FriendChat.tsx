import React from "react";
import { Stack, Box, Typography, Button } from "@mui/material";
import moment from "moment";
import { useRoom } from "../../state/messages/hooks";
import Avatar, { avatarProps } from "../common/Avatar";
import { IChat, useChat } from "../../hooks/ui/chat";

const FriendChat: React.FC<{
  chat: IChat;
}> = ({ chat }) => {
  const { id } = chat;
  const { setCurrentRoom, getRoomMessages } = useRoom();
  const { isCurrentRoom } = useChat();
  const isCurr = isCurrentRoom(id);

  return (
    <Button
      onClick={() => {
        setCurrentRoom(id);
        getRoomMessages(id);
      }}
      variant="outlined"
      color={isCurr ? "primary" : "secondary"}
      sx={{
        display: "flex",
        width: "100%",
        bgcolor: "common.white",
        ":hover": {
          bgcolor: !isCurr ? "grey.300" : "current",
        },
        borderRadius: "0.6rem",
        p: "20px 24px",
        mb: "8px",
      }}
    >
      <Box sx={{ mr: "8px" }}>
        <Avatar name={chat.name} isActive={chat.isActive} />
      </Box>

      <Stack flexGrow={1} sx={{ ml: "8px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography color="grey.700">{chat.name}</Typography>
          <Typography fontSize="10px" color="grey.500">
            {moment(chat.updatedAt).format("LT")}
          </Typography>
        </Stack>
        <Typography
          textAlign="left"
          fontSize="12px"
          color="grey.500"
          textTransform="lowercase"
        >
          {chat.email}
        </Typography>
      </Stack>
    </Button>
  );
};

export default FriendChat;
