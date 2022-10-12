import React from "react";
import Modal from "../common/Modal";
import { Box } from "@mui/material";
import AddFriends from "./AddFriends";
import { useAppModal } from "../../state/app/hooks";
import { AppModal } from "../../state/app/reducer";

const AddFriendModal = () => {
  const modal = useAppModal();
  return (
    <Modal open={modal.isShown(AppModal.AddFriend)} onClose={() => {}}>
      <AddFriends />
    </Modal>
  );
};

export default AddFriendModal;
