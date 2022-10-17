import { createAction } from "@reduxjs/toolkit";
import { UserWithRelation } from "./reducer";

export const getUsersReq = createAction("get-users/req");
export const getUsersRes =
  createAction<Array<UserWithRelation>>("get-users/res");
export const getUsersErr = createAction<string>("get-users/err");
