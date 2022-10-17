import Modal from "../common/Modal";
import ManageFriends from "./ManageFriends";
import { useAppModal } from "../../state/app/hooks";
import { AppModal } from "../../state/app/reducer";

const ManageFriendsModal = () => {
  const modal = useAppModal();
  return (
    <Modal open={modal.isShown(AppModal.AddFriend)}>
      <ManageFriends />
    </Modal>
  );
};

export default ManageFriendsModal;
