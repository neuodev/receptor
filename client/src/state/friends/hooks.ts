import { useEffect } from "react";
import axios from "axios";
import { getEndpoint } from "../../constants/api";
import { useAppDispatch, useAppSelector } from "../../store";
import { getErrMsg } from "../../utils/error";
import { useAuthHeaders } from "../user/hooks";
import { getFriendsErr, getFriendsReq, getFriendsRes } from "./actions";
import { useAppSocket } from "../../wss/appSocket";
import { IFriend } from "./reducer";

export const useFriends = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const headers = useAuthHeaders();
  const { joinRooms } = useAppSocket();

  async function getFriends() {
    try {
      dispatch(getFriendsReq());
      const { data } = await axios.get<Array<IFriend>>(
        getEndpoint("getFriends"),
        {
          headers,
        }
      );
      joinRooms(data.map((entry) => entry.roomId));
      dispatch(getFriendsRes(data));
    } catch (error) {
      dispatch(getFriendsErr(getErrMsg(error)));
    }
  }

  useEffect(() => {
    getFriends();
  }, [user]);
};
