import { useAppDispatch } from "../../store";
import { FriendEventRes } from "../../wss";
import { useAppSocket } from "../../wss/appSocket";
import { resetMessages } from "../messages/actions";
import { useUsers } from "../users/hooks";
import { setFriendErr, setFriendReq, setFriendRes } from "./actions";
import { FriendAction } from "./reducer";

export const useFriend = () => {
  const dispatch = useAppDispatch();
  const appSocket = useAppSocket();
  const { getUsers } = useUsers();

  function addFriend(id: number) {
    dispatch(setFriendReq({ userId: id, action: FriendAction.Add }));
    appSocket.addFriend(id);
  }

  async function handleAddFreindRes(res: FriendEventRes) {
    if (res.error) {
      dispatch(
        setFriendErr({
          action: FriendAction.Add,
          userId: res.friendId,
          error: res.error,
        })
      );
    } else {
      await refreshState();
      dispatch(
        setFriendRes({ action: FriendAction.Add, userId: res.friendId })
      );
    }
  }

  function acceptFriend(id: number) {
    dispatch(setFriendReq({ userId: id, action: FriendAction.Accept }));
    appSocket.acceptFriend(id);
  }

  async function handleAcceptFriendRes(res: FriendEventRes) {
    if (res.error) {
      dispatch(
        setFriendErr({
          action: FriendAction.Accept,
          userId: res.friendId,
          error: res.error,
        })
      );
    } else {
      await refreshState();
      dispatch(
        setFriendRes({ action: FriendAction.Accept, userId: res.friendId })
      );
    }
  }

  function removeFriend(id: number) {
    dispatch(setFriendReq({ userId: id, action: FriendAction.Remove }));
    appSocket.removeFriend(id);
  }

  async function handleRemoveFriendRes(res: FriendEventRes) {
    if (res.error) {
      dispatch(
        setFriendErr({
          action: FriendAction.Remove,
          userId: res.friendId,
          error: res.error,
        })
      );
    } else {
      await refreshState();
      dispatch(
        setFriendRes({ action: FriendAction.Remove, userId: res.friendId })
      );
    }
  }

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
