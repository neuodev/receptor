import React from "react";
import { Stack, Box, Avatar, Typography, Button } from "@mui/material";
import { stringAvatar } from "../../utils/colors";
import { getAvatarLetters } from "../../utils";

const AddFriendCard: React.FC<{
  friend: { username: string; status: string };
}> = ({ friend }) => {
  const { username, status } = friend;
  return (
    <Stack direction="row" alignItems="center">
      <Avatar {...stringAvatar(username)}>{getAvatarLetters(username)}</Avatar>
      <Stack flexGrow={1} ml="8px">
        <Typography variant="body2" fontWeight={500}>
          {username}
        </Typography>
        <Typography variant="caption" color="grey.500">
          {status}
        </Typography>
      </Stack>

      <Button variant="outlined" size="small">
        Send
      </Button>
    </Stack>
  );
};

export default AddFriendCard;
