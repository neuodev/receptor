import axios from "axios";
import { useNavigate } from "react-router-dom";
import { COMMON_HEADERS, getEndpoint } from "../../constants/api";
import { ROUTES } from "../../constants/routes";
import { LoginReq, RegisterReq, useUserApi } from "../../hooks/api/user";
import { useAppDispatch, useAppSelector } from "../../store";
import { getErrMsg } from "../../utils/error";
import { useAppSocket } from "../../wss/appSocket";
import { resetFriends } from "../friends/actions";
import { resetMessages } from "../messages/actions";
import { authUserErr, authUserInfo, authUserReq, userLogout } from "./actions";

export const useUserHooks = () => {
  const appSocket = useAppSocket();
  const userApi = useUserApi();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const login = async (data: LoginReq) => {
    try {
      dispatch(authUserReq());
      const { token, user } = await userApi.login(data);
      appSocket.login(token);
      dispatch(authUserInfo({ user, token }));
      navigate(ROUTES.ROOT);
    } catch (error) {
      dispatch(authUserErr(getErrMsg(error)));
    }
  };

  const register = async (data: RegisterReq) => {
    try {
      logout();
      dispatch(authUserReq());
      userApi.register(data);
      login({ email: data.email, password: data.password });
    } catch (error) {
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
