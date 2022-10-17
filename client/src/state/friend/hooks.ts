import { useAppDispatch } from "../../store";
import { AddFriendRes } from "../../wss";
import { useAppSocket } from "../../wss/appSocket";
import { resetMessages } from "../messages/actions";
import { useUsers } from "../users/hooks";
import {
  acceptFriendReq,
  addFriendErr,
  addFriendReq,
  addFriendRes,
  removeFriendReq,
} from "./actions";

export const useFriend = () => {
  const dispatch = useAppDispatch();
  const appSocket = useAppSocket();
  const { getUsers } = useUsers();

  function addFriend(id: number) {
    dispatch(addFriendReq(id));
    appSocket.addFriend(id);
  }

  async function handleAddFreindRes(res: AddFriendRes) {
    if (res.error) {
      dispatch(addFriendErr({ userId: res.friendId, error: res.error }));
    } else {
      await refreshState();
      dispatch(addFriendRes(res.friendId));
    }
  }

  function acceptFriend(id: number) {
    dispatch(acceptFriendReq(id));
    appSocket.acceptFriend(id);
  }

  function handleAcceptFriendRes() {}

  function removeFriend(id: number) {
    dispatch(removeFriendReq(id));
    appSocket.removeFriend(id);
  }

  function handleRemoveFriendRes() {}

  async function refreshState() {
    await getUsers();
    dispatch(resetMessages());
  }

  return {
    addFriend,
    acceptFriend,
    removeFriend,
    handleAddFreindRes,
    handleAcceptFriendRes,
    handleRemoveFriendRes,
  };
};
