import { useUserApi } from "../../hooks/api/user";
import { useAppDispatch } from "../../store";
import { getErrMsg } from "../../utils/error";
import { useAppSocket } from "../../wss/appSocket";
import { addFriendReq, getUsersErr, getUsersReq, getUsersRes } from "./actions";

export const useAddFriend = () => {
  const dispatch = useAppDispatch();
  const appSocket = useAppSocket();
  const userApi = useUserApi();

  async function getUsers(q?: string, limit: number = 10, page = 1) {
    try {
      const users = await userApi.getUsers(q, limit, page);
      dispatch(getUsersRes(users));
    } catch (error) {
      dispatch(getUsersErr(getErrMsg(error)));
    }
  }

  async function getUsersHandler(q: string, limit = 10, page = 1) {
    dispatch(getUsersReq());
    await getUsers(q, limit, page);
  }

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
  return { getUsersHandler, addFriend, acceptFriend, removeFriend, getUsers };
};
