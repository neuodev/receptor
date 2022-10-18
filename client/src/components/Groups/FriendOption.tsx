import React from "react";
import { IFriend } from "../../state/friends/reducer";
import { Typography, Stack, Checkbox, Box } from "@mui/material";
import Avatar, { avatarProps } from "../common/Avatar";
import moment from "moment";

const FriendOption: React.FC<{
  friend: IFriend;
  onSelect(id: number): void;
}> = ({ friend, onSelect }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      mb="16px"
      sx={{
        p: "20px 24px",
        bgcolor: "common.white",
        borderRadius: "var(--common-br)",
        ":hover": {
          bgcolor: "grey.300",
        },
      }}
    >
      <Box>
        <Avatar {...avatarProps(friend)} />
      </Box>
      <Stack sx={{ ml: "12px" }}>
        <Typography variant="body1" color="grey.900" fontWeight={500}>
          {friend.username}
        </Typography>
        <Typography variant="body2" color="grey.700">
          {friend.isActive
            ? friend.email
            : "Last seen " + moment(friend.updatedAt).fromNow()}
        </Typography>
      </Stack>
      <Checkbox />
    </Stack>
  );
};

export default FriendOption;
