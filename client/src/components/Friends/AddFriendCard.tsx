import React from "react";
import { Stack, Box, Avatar, Typography, Button } from "@mui/material";
import { stringAvatar } from "../../utils/colors";
import { IUser } from "../../state/user/reducer";
import moment from "moment";

const AddFriendCard: React.FC<{
  user: IUser;
}> = ({ user }) => {
  const { username, isActive, updatedAt } = user;
  return (
    <Stack direction="row" alignItems="center">
      <Avatar {...stringAvatar(username)} />
      <Stack flexGrow={1} ml="8px">
        <Typography variant="body2" fontWeight={500} textTransform="capitalize">
          {username}
        </Typography>
        <Typography variant="caption" color="grey.500">
          {isActive ? "online" : "Last seen " + moment(updatedAt).fromNow()}
        </Typography>
      </Stack>

      <Button variant="outlined" size="small">
        Send
      </Button>
    </Stack>
  );
};

export default AddFriendCard;
