import axios from "axios";
import { COMMON_HEADERS, getEndpoint } from "../../constants/api";
import { useAppDispatch, useAppSelector } from "../../store";
import { getErrMsg } from "../../utils/error";
import { useAppScoket } from "../../wss/appSocket";
import { useAuthHeaders } from "../user/hooks";
import { addFriendReq, getUsersErr, getUsersReq, getUsersRes } from "./actions";

export const useAddFriend = () => {
  const dispatch = useAppDispatch();
  const appScoket = useAppScoket();
  const headers = useAuthHeaders();

  async function getUsersList(q: string, limit = 10, page = 1) {
    try {
      dispatch(getUsersReq());
      const { data } = await axios.get(getEndpoint("getUsers"), {
        headers,
        params: {
          q,
          limit,
          page,
        },
      });
      dispatch(getUsersRes(data.users));
    } catch (error) {
      dispatch(getUsersErr(getErrMsg(error)));
    }
  }

  async function addFriend(id: number) {
    dispatch(addFriendReq());
    appScoket.addFriend(id);
  }

  return { getUsersList, addFriend };
};
