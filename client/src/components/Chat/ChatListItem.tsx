import React from "react";
import { Stack, Box, Avatar, Typography, Button } from "@mui/material";
import { IUser } from "../../state/user/reducer";
import { stringAvatar } from "../../utils/colors";
import moment from "moment";
import { useRoom } from "../../state/messages/hooks";

const ChatListItem: React.FC<{
  friend: { roomId: number; user: IUser };
}> = ({ friend }) => {
  const { user, roomId } = friend;
  const { setCurrentRoom, getRoomMessages } = useRoom();

  return (
    <Button
      onClick={() => {
        setCurrentRoom(roomId);
        getRoomMessages(roomId);
      }}
      variant="text"
      color="secondary"
      sx={{
        display: "flex",
        width: "100%",
        bgcolor: "common.white",
        ":hover": {
          bgcolor: "grey.300",
        },
        borderRadius: "0.6rem",
        p: "20px 24px",
      }}
    >
      <Box sx={{ mr: "8px" }}>
        <Avatar {...stringAvatar(user.username)} />
      </Box>

      <Stack flexGrow={1} sx={{ ml: "8px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography color="grey.700">{user.username}</Typography>
          <Typography fontSize="10px" color="grey.500">
            {moment(user.updatedAt).format("LT")}
          </Typography>
        </Stack>
        <Typography textAlign="left" fontSize="12px" color="grey.500">
          {user.isActive ? "Online" : "Offline"}
        </Typography>
      </Stack>
    </Button>
  );
};

export default ChatListItem;
