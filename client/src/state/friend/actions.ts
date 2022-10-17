import { createAction } from "@reduxjs/toolkit";
import { UserId } from "./reducer";

export const addFriendReq = createAction<UserId>("friend/add-req");
export const addFriendRes = createAction<UserId>("friend/add-res");
export const addFriendErr = createAction<{
  userId: UserId;
  error: string | null;
}>("friend/add-err");

export const acceptFriendReq = createAction<UserId>("friend/accept-req");
export const acceptFriendRes = createAction<UserId>("friend/accept-res");
export const acceptFriendErr = createAction<{
  userId: UserId;
  error: string | null;
}>("friend/accept-err");

export const removeFriendReq = createAction<UserId>("friend/remove-req");
export const removeFriendRes = createAction<UserId>("friend/remove-res");
export const removeFriendErr = createAction<{
  userId: UserId;
  error: string | null;
}>("friend/remove-err");
