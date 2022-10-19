import { createAction } from "@reduxjs/toolkit";
import { GroupAction, IGroup } from "./reducer";

export const getGroupsReq = createAction("groups/get-req");
export const getGroupsRes = createAction<IGroup[]>("groups/get-res");
export const getGroupsErr = createAction<string>("groups/get-err");

export const createGroupsReq = createAction("group/create-req");
export const createGroupsRes = createAction("group/create-res");
export const createGroupsErr = createAction<string>("groups/create-err");
export const creageGroupRest = createAction("group/create-reset");

export const groupActionReq = createAction<{
  action: GroupAction;
  groupId: number;
}>("group/req");
export const groupActionRes = createAction<{
  action: GroupAction;
  groupId: number;
}>("group/res");
export const groupActionErr = createAction<{
  action: GroupAction;
  groupId: number;
  error: string;
}>("group/err");
