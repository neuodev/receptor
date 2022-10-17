import { useAppDispatch } from "../../store";
import { useAppSocket } from "../../wss/appSocket";
import { addFriendReq } from "./actions";

export const useFriend = () => {
  const dispatch = useAppDispatch();
  const appSocket = useAppSocket();

  function addFriend(id: number) {
    // todo: Remove dispatch
    dispatch(addFriendReq());
    appSocket.addFriend(id);
  }

  function acceptFriend(id: number) {
    appSocket.acceptFriend(id);
  }

  function removeFriend(id: number) {
    appSocket.removeFriend(id);
  }
  return { addFriend, acceptFriend, removeFriend };
};
