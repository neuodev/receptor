import axios from "axios";
import { getEndpoint } from "../../constants/api";
import { useAppDispatch } from "../../store";
import { getErrMsg } from "../../utils/error";
import { getUsersErr, getUsersReq, getUsersRes } from "./actions";

export const useAddFriend = () => {
  const dispatch = useAppDispatch();

  async function getUsersList(q: string, limit = 10, page = 1) {
    try {
      dispatch(getUsersReq());
      const { data } = await axios.get(getEndpoint("users"), {
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

  return { getUsersList };
};
