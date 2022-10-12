import { useAppDispatch, useAppSelector } from "../../store";
import { hideAppModal, showAppModal } from "./actions";
import { AppModal } from "./reducer";

export const useAppModal = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.app);

  function isShown(modal: AppModal) {
    return state.modal === modal;
  }

  function showModal(modal: AppModal) {
    dispatch(showAppModal(modal));
  }

  function hideModal() {
    dispatch(hideAppModal());
  }

  return {
    isShown,
    showModal,
    hideModal,
  };
};
