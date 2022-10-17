import { useUserApi } from "../../hooks/api/user";
import { useAppDispatch } from "../../store";
import { getErrMsg } from "../../utils/error";
import { getUsersErr, getUsersReq, getUsersRes } from "./actions";

export const useUsers = () => {
  const dispatch = useAppDispatch();
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

  return { getUsersHandler, getUsers };
};
