import { createAction } from "@reduxjs/toolkit";
import { FriendAction, UserId } from "./reducer";

export const setFriendReq = createAction<{
  action: FriendAction;
  userId: UserId;
}>("friend/add-req");
export const setFriendRes = createAction<{
  action: FriendAction;
  userId: UserId;
}>("friend/add-res");
export const setFriendErr = createAction<{
  action: FriendAction;
  userId: UserId;
  error: string | null;
}>("friend/add-err");
