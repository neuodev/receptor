import { createAction } from "@reduxjs/toolkit";
import { IUser } from "../user/reducer";

export const addFriendReq = createAction("add-friend/req");
export const addFriendRes = createAction("add-friend/res");
export const addFriendErr = createAction<string>("add-friend/err");

export const getUsersReq = createAction("get-users/req");
export const getUsersRes = createAction<IUser[]>("get-users/res");
export const getUsersErr = createAction<string>("get-users/err");
