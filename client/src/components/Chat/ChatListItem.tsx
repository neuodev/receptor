import React from "react";
import { Stack, Box, Avatar, Typography } from "@mui/material";
import { IUser } from "../../state/user/reducer";
import { stringAvatar } from "../../utils/colors";
import moment from "moment";

const ChatListItem: React.FC<{
  friend: { roomId: number; user: IUser };
}> = ({ friend }) => {
  const { user } = friend;
  return (
    <Stack
      direction="row"
      sx={{ bgcolor: "common.white", borderRadius: "0.6rem", p: "20px 24px" }}
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
          <Typography>{user.username}</Typography>
          <Typography fontSize="10px" color="grey.500">
            {moment(user.updatedAt).format("LT")}
          </Typography>
        </Stack>
        <Typography fontSize="12px" color="grey.500">
          {user.isActive ? "Online" : "Offline"}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default ChatListItem;
