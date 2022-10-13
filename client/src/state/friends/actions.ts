import { createAction } from "@reduxjs/toolkit";
import { IUser } from "../user/reducer";

export const getFriendsReq = createAction("get-friends/req");
export const getFriendsRes =
  createAction<Array<{ roomId: number; user: IUser }>>("get-friends/res");
export const getFriendsErr = createAction<string>("get-friends/err");
