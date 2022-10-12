import axios from "axios";
import { useNavigate } from "react-router-dom";
import { COMMON_HEADERS, getEndpoint } from "../../constants/api";
import { ROUTES } from "../../constants/routes";
import { useAppDispatch } from "../../store";
import { getErrMsg } from "../../utils/error";
import { useAppScoket } from "../../wss/appSocket";
import {
  authUserErr,
  authUserInfo,
  authUserReq,
  setUserFriends,
} from "./actions";

export const useUserHooks = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const appSocket = useAppScoket();

  const login = async (data: { email: string; password: string }) => {
    try {
      dispatch(authUserReq());
      const res = await axios.post(getEndpoint("login"), data, {
        headers: COMMON_HEADERS,
      });
      const { user, token, roomIds, friends } = res.data;
      dispatch(authUserInfo({ user, token }));
      dispatch(setUserFriends({ rooms: roomIds, friends }));
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
      dispatch(authUserErr(getErrMsg(error)));
    }
  };

  return { login, register };
};
