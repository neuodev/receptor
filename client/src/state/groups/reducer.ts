import { createReducer } from "@reduxjs/toolkit";
import produce from "immer";
import { clone } from "../../utils";
import { IUser } from "../user/reducer";
import {
  creageGroupRest,
  createGroupsErr,
  createGroupsReq,
  createGroupsRes,
  getGroupsErr,
  getGroupsReq,
  getGroupsRes,
  groupActionErr,
  groupActionReq,
  groupActionRes,
} from "./actions";

export interface IGroup {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  participants: IUser & { joinedAt: string };
}

export type GropuId = number;

type BaseState = {
  loading: { [key: GropuId]: boolean };
  error: { [key: GropuId]: string | null };
};

const baseState = {
  loading: {},
  error: {},
};

export enum GroupAction {
  Delete = "delete",
  Leave = "leave",
}

type State = {
  groups: {
    loading: boolean;
    error: string | null;
    list: IGroup[];
  };
  create: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  delete: BaseState;
  leave: BaseState;
};

export const gorupsReducer = createReducer<State>(
  {
    groups: {
      loading: false,
      error: null,
      list: [],
    },
    create: {
      loading: false,
      error: null,
      success: false,
    },
    delete: clone(baseState),
    leave: clone(baseState),
  },
  (builder) => {
    builder
      .addCase(getGroupsReq, (state) =>
        produce(state, (draftState) => {
          draftState.groups.loading = true;
          draftState.groups.error = null;
        })
      )
      .addCase(getGroupsRes, (state, { payload }) =>
        produce(state, (draftState) => {
          draftState.groups.list = payload;
          draftState.groups.loading = false;
          draftState.groups.error = null;
        })
      )
      .addCase(getGroupsErr, (state, { payload }) =>
        produce(state, (draftState) => {
          draftState.groups.loading = false;
          draftState.groups.error = payload;
        })
      )
      .addCase(createGroupsReq, (state) =>
        produce(state, (draftState) => {
          draftState.create.loading = true;
          draftState.create.error = null;
        })
      )
      .addCase(createGroupsRes, (state) =>
        produce(state, (draftState) => {
          draftState.create.loading = false;
          draftState.create.error = null;
          draftState.create.success = true;
        })
      )
      .addCase(createGroupsErr, (state, { payload }) =>
        produce(state, (draftState) => {
          draftState.create.loading = false;
          draftState.create.error = payload;
          draftState.create.success = false;
        })
      )
      .addCase(creageGroupRest, (state) =>
        produce(state, (draftState) => {
          draftState.create.loading = false;
          draftState.create.error = null;
          draftState.create.success = false;
        })
      )
      .addCase(groupActionReq, (state, { payload: { action, groupId } }) =>
        produce(state, (draftState) => {
          draftState[action].loading[groupId] = true;
          draftState[action].error[groupId] = null;
        })
      )
      .addCase(groupActionRes, (state, { payload: { action, groupId } }) =>
        produce(state, (draftState) => {
          draftState[action].loading[groupId] = false;
          draftState[action].error[groupId] = null;
        })
      )
      .addCase(
        groupActionErr,
        (state, { payload: { action, groupId, error } }) =>
          produce(state, (draftState) => {
            draftState[action].loading[groupId] = false;
            draftState[action].error[groupId] = error;
          })
      );
  }
);
