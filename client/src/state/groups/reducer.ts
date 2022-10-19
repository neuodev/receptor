import { createReducer } from "@reduxjs/toolkit";
import produce from "immer";
import { clone } from "../../utils";
import { IUser } from "../user/reducer";
import {
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
  Create = "create",
  Delete = "delete",
  Leave = "leave",
}

type State = {
  groups: {
    loading: boolean;
    error: string | null;
    list: IGroup[];
  };
  create: BaseState;
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
    create: clone(baseState),
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
