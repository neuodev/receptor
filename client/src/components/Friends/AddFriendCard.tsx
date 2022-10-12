import React from "react";
import { Stack, Box, Avatar, Typography, Button } from "@mui/material";
import { stringAvatar } from "../../utils/colors";
import { IUser } from "../../state/user/reducer";
import moment from "moment";
import { useAddFriend } from "../../state/addFriend/hooks";

const AddFriendCard: React.FC<{
  user: IUser;
}> = ({ user }) => {
  const { addFriend } = useAddFriend();
  const { username, isActive, updatedAt, id } = user;
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

      <Button variant="outlined" size="small" onClick={() => addFriend(id)}>
        Send
      </Button>
    </Stack>
  );
};

export default AddFriendCard;
