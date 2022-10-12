import React from "react";
import Modal from "../common/Modal";
import { Box } from "@mui/material";
import AddFriends from "./AddFriends";

const AddFriendModal = () => {
  return (
    <Modal open={true} onClose={() => {}}>
      <AddFriends />
    </Modal>
  );
};

export default AddFriendModal;
