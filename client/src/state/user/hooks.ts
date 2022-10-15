import axios from "axios";
import { useNavigate } from "react-router-dom";
import { COMMON_HEADERS, getEndpoint } from "../../constants/api";
import { ROUTES } from "../../constants/routes";
import { useAppDispatch, useAppSelector } from "../../store";
import { getErrMsg } from "../../utils/error";
import { useAppSocket } from "../../wss/appSocket";
import { resetFriends } from "../friends/actions";
import { resetMessages } from "../messages/actions";
import { authUserErr, authUserInfo, authUserReq, userLogout } from "./actions";

export const useUserHooks = () => {
  const dispatch = useAppDispatch();
  const appSocket = useAppSocket();
  const navigate = useNavigate();

  const login = async (data: { email: string; password: string }) => {
    try {
      dispatch(authUserReq());
      const res = await axios.post(getEndpoint("login"), data, {
        headers: COMMON_HEADERS,
      });
      const { user, token } = res.data;
      appSocket.login(token);
      dispatch(authUserInfo({ user, token }));
      navigate(ROUTES.ROOT);
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
    appSocket.logout();
    dispatch(userLogout());
    dispatch(resetFriends());
    dispatch(resetMessages());
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
