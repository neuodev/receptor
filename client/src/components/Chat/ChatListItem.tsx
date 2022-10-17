import React from "react";
import { Stack, Box, Typography, Button } from "@mui/material";
import moment from "moment";
import { useRoom } from "../../state/messages/hooks";
import Avatar, { avatarProps } from "../common/Avatar";
import { IFriend } from "../../state/friends/reducer";
import { useAppSelector } from "../../store";

const ChatListItem: React.FC<{
  friend: IFriend;
}> = ({ friend }) => {
  const { roomId } = friend;
  const currRoomId = useAppSelector((state) => state.messages.currRoom);
  const { setCurrentRoom, getRoomMessages } = useRoom();

  return (
    <Button
      onClick={() => {
        setCurrentRoom(roomId);
        getRoomMessages(roomId);
      }}
      variant="outlined"
      color={currRoomId === roomId ? "primary" : "secondary"}
      sx={{
        display: "flex",
        width: "100%",
        bgcolor: "common.white",
        ":hover": {
          bgcolor: currRoomId !== roomId ? "grey.300" : "current",
        },
        borderRadius: "0.6rem",
        p: "20px 24px",
        mb: "8px",
      }}
    >
      <Box sx={{ mr: "8px" }}>
        <Avatar {...avatarProps(friend)} />
      </Box>

      <Stack flexGrow={1} sx={{ ml: "8px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography color="grey.700">{friend.username}</Typography>
          <Typography fontSize="10px" color="grey.500">
            {moment(friend.updatedAt).format("LT")}
          </Typography>
        </Stack>
        <Typography
          textAlign="left"
          fontSize="12px"
          color="grey.500"
          textTransform="lowercase"
        >
          {friend.email}
        </Typography>
      </Stack>
    </Button>
  );
};

export default ChatListItem;
