import React from "react";
import { Stack, Typography, Button } from "@mui/material";
import { IUser } from "../../state/user/reducer";
import moment from "moment";
import { useAddFriend } from "../../state/addFriend/hooks";
import Avatar, { avatarProps } from "../common/Avatar";

const AddFriendCard: React.FC<{
  user: IUser;
}> = ({ user }) => {
  const { addFriend } = useAddFriend();
  const { username, isActive, updatedAt, id, email } = user;
  return (
    <Stack direction="row" alignItems="center">
      <Avatar {...avatarProps(user)} />
      <Stack flexGrow={1} ml="8px">
        <Typography variant="body2" fontWeight={500} textTransform="capitalize">
          {username}
        </Typography>
        <Typography variant="caption" color="grey.500">
          {isActive ? email : "Last seen " + moment(updatedAt).fromNow()}
        </Typography>
      </Stack>

      <Button variant="outlined" size="small" onClick={() => addFriend(id)}>
        Send
      </Button>
    </Stack>
  );
};

export default AddFriendCard;
