import { createAction } from "@reduxjs/toolkit";
import { IUser } from "../user/reducer";

export const getFriendsReq = createAction("get-friends/req");
export const getFriendsRes =
  createAction<Array<{ roomId: number; user: IUser }>>("friends/get-res");
export const getFriendsErr = createAction<string>("friends/get-err");
export const updateUser = createAction<IUser>("friend/update");
