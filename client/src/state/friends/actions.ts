import { createAction } from "@reduxjs/toolkit";
import { IUser } from "../user/reducer";
import { IFriend } from "./reducer";

export const getFriendsReq = createAction("get-friends/req");
export const getFriendsRes = createAction<Array<IFriend>>("friends/get-res");
export const getFriendsErr = createAction<string>("friends/get-err");
export const updateUser = createAction<IUser>("friends/update");
export const resetFriends = createAction("friends/reset");
