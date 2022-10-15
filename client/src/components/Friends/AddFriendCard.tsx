import React from "react";
import { Stack, Typography, Button } from "@mui/material";
import { IUser } from "../../state/user/reducer";
import moment from "moment";
import { useAddFriend } from "../../state/addFriend/hooks";
import Avatar, { avatarProps } from "../common/Avatar";
import { UsersRelation } from "../../state/addFriend/reducer";

const AddFriendCard: React.FC<{
  user: IUser & { relation: UsersRelation };
}> = ({ user }) => {
  const { addFriend } = useAddFriend();
  const { username, isActive, updatedAt, id, email, relation } = user;
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
      <CardAction relation={relation} id={id} />
    </Stack>
  );
};

export default AddFriendCard;

const CardAction: React.FC<{ relation: UsersRelation; id: number }> = ({
  relation,
  id,
}) => {
  switch (relation) {
    case UsersRelation.Friends:
      return (
        <Button variant="outlined" color="error" size="small">
          Remove
        </Button>
      );
    case UsersRelation.NotFriends:
      return (
        <Button variant="outlined" size="small">
          Add
        </Button>
      );
    case UsersRelation.PendingRequest:
      return (
        <Button variant="outlined" size="small">
          Accept
        </Button>
      );
    case UsersRelation.PendingResponse:
      return (
        <Button variant="outlined" size="small" disabled>
          Sent
        </Button>
      );
    default:
      return null;
  }
};
