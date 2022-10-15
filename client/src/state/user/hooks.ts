import axios from "axios";
import { COMMON_HEADERS, getEndpoint } from "../../constants/api";
import { useAppDispatch, useAppSelector } from "../../store";
import { getErrMsg } from "../../utils/error";
import { useAppScoket } from "../../wss/appSocket";
import { authUserErr, authUserInfo, authUserReq, userLogout } from "./actions";

export const useUserHooks = () => {
  const dispatch = useAppDispatch();
  const appSocket = useAppScoket();

  const login = async (data: { email: string; password: string }) => {
    try {
      dispatch(authUserReq());
      const res = await axios.post(getEndpoint("login"), data, {
        headers: COMMON_HEADERS,
      });
      const { user, token } = res.data;
      dispatch(authUserInfo({ user, token }));
      appSocket.login(token);
    } catch (error) {
      dispatch(authUserErr(getErrMsg(error)));
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      dispatch(authUserReq());
      await axios.post(getEndpoint("register"), data, {
        headers: COMMON_HEADERS,
      });
      login({ email: data.email, password: data.password });
    } catch (error) {
      console.log(error);
      dispatch(authUserErr(getErrMsg(error)));
    }
  };

  const logout = () => {
    dispatch(userLogout());
  };

  return { login, register, logout };
};

export const useAuthHeaders = () => {
  const token = useAppSelector((state) => state.user.authToken);

  return {
    ...COMMON_HEADERS,
    authorization: `Bearer ${token}`,
  };
};
