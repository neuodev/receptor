import { useEffect } from "react";
import axios from "axios";
import { getEndpoint } from "../../constants/api";
import { useAppDispatch, useAppSelector } from "../../store";
import { getErrMsg } from "../../utils/error";
import { useAuthHeaders } from "../user/hooks";
import { getFriendsErr, getFriendsReq, getFriendsRes } from "./actions";
import { useAppSocket } from "../../wss/appSocket";
import { IFriend } from "./reducer";
import { useUserApi } from "../../hooks/api/user";

export const useFriends = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const users = useAppSelector((state) => state.users);
  const friend = useAppSelector((state) => state.friend);
  const userApi = useUserApi();
  const { joinRooms } = useAppSocket();

  /**
   * Update friends list in the background
   * */
  async function refreshFriendsList() {
    try {
      const friends = await userApi.getUserFriends();
      joinRooms(friends.map((friend) => friend.roomId));
      dispatch(getFriendsRes(friends));
    } catch (error) {
      dispatch(getFriendsErr(getErrMsg(error)));
    }
  }

  async function getFriends() {
    dispatch(getFriendsReq());
    await refreshFriendsList();
  }

  useEffect(() => {
    refreshFriendsList();
  }, [user, users, friend]);

  useEffect(() => {
    getFriends();
  }, []);

  return { getFriends };
};
