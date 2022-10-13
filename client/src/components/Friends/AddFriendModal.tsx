import Modal from "../common/Modal";
import AddFriends from "./AddFriends";
import { useAppModal } from "../../state/app/hooks";
import { AppModal } from "../../state/app/reducer";

const AddFriendModal = () => {
  const modal = useAppModal();
  return (
    <Modal open={modal.isShown(AppModal.AddFriend)}>
      <AddFriends />
    </Modal>
  );
};

export default AddFriendModal;
