import React from "react";
import { Box, Avatar, Typography, Button } from "@mui/material";
import { stringAvatar } from "../../utils/colors";

const AddFriendCard: React.FC<{
  friend: { username: string; status: string };
}> = ({ friend }) => {
  return (
    <Box>
      <Avatar {...stringAvatar(friend.username)}>{friend.username}</Avatar>
      <Box>
        <Typography>{friend.username}</Typography>
        <Typography>{friend.status}</Typography>
      </Box>

      <Button>Send</Button>
    </Box>
  );
};

export default AddFriendCard;
