import { createAction } from "@reduxjs/toolkit";

export const addFriendReq = createAction("add-friend/req");
export const addFriendRes = createAction("add-friend/res");
export const addFriendErr = createAction<string>("add-friend/err");
