import { useEffect } from "react";
import axios from "axios";
import { getEndpoint } from "../../constants/api";
import { useAppDispatch, useAppSelector } from "../../store";
import { getErrMsg } from "../../utils/error";
import { useAuthHeaders } from "../user/hooks";
import { getFriendsErr, getFriendsReq, getFriendsRes } from "./actions";

export const useFriends = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const headers = useAuthHeaders();

  async function getFriends() {
    try {
      dispatch(getFriendsReq());
      const { data } = await axios.get(getEndpoint("getFriends"), {
        headers,
      });
      dispatch(getFriendsRes(data));
    } catch (error) {
      dispatch(getFriendsErr(getErrMsg(error)));
    }
  }

  useEffect(() => {
    getFriends();
  }, [user]);
};
