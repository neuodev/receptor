import axios from "axios";
import { useNavigate } from "react-router-dom";
import { COMMON_HEADERS, getEndpoint } from "../../constants/api";
import { ROUTES } from "../../constants/routes";
import { useAppDispatch, useAppSelector } from "../../store";
import { getErrMsg } from "../../utils/error";
import {
  authUserErr,
  authUserInfo,
  authUserReq,
  setUserFriends,
} from "./actions";

export const useUserHooks = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const signIn = async (username: string, password: string) => {
    try {
      dispatch(authUserReq());
      const res = await axios.post(
        getEndpoint("login"),
        { username, password },
        {
          headers: COMMON_HEADERS,
        }
      );
      const { user, token, roomIds, friends } = res.data;
      dispatch(authUserInfo({ user, token }));
      dispatch(setUserFriends({ rooms: roomIds, friends }));
      navigate(ROUTES.ROOT);
    } catch (error) {
      dispatch(authUserErr(getErrMsg(error)));
    }
  };

  return { signIn };
};
