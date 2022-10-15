import { createAction } from "@reduxjs/toolkit";
import { IUser } from "./reducer";

export const authUserReq = createAction("user/auth-req");
export const authUserErr = createAction<string>("user/auth-err");
export const authUserInfo = createAction<{ user: IUser; token: string }>(
  "user/auth-res"
);
export const setUserFriends = createAction<{
  rooms: number[];
  friends: Array<{ roomId: number; user: IUser }>;
}>("user/friends");

export const userLogout = createAction("user/logout");
