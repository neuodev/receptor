import React from "react";
import Center from "../common/Center";
import { Typography, Button } from "@mui/material";
import { useAppModal } from "../../state/app/hooks";
import { AppModal } from "../../state/app/reducer";

const NoFriends = () => {
  const modal = useAppModal();
  return (
    <Center>
      <img src="./images/friends.png" alt="No Friends" title="No friends" />
      <Typography>You have no friends yet!</Typography>
      <Button
        onClick={() => modal.show(AppModal.AddFriend)}
        variant="outlined"
        sx={{ mt: "16px" }}
      >
        <Typography>Add friend</Typography>
      </Button>
    </Center>
  );
};

export default NoFriends;
