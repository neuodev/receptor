import { createReducer } from "@reduxjs/toolkit";
import produce from "immer";
import { getUsersErr, getUsersReq, getUsersRes } from "./actions";
import { IUser } from "../user/reducer";

export enum UsersRelation {
  Friends = "friends",
  NotFriends = "not-friends",
  PendingRequest = "pending-request",
  PendingResponse = "pending-response",
}

export type UserWithRelation = IUser & { relation: UsersRelation };

type State = {
  loading: boolean;
  error: string | null;
  list: UserWithRelation[];
};

export const usersReducer = createReducer<State>(
  {
    loading: false,
    error: null,
    list: [],
  },
  (builder) => {
    builder
      .addCase(getUsersReq, (state) =>
        produce(state, (draftState) => {
          draftState.loading = true;
          draftState.error = null;
        })
      )
      .addCase(getUsersRes, (state, { payload }) =>
        produce(state, (draftState) => {
          draftState.loading = false;
          draftState.error = null;
          draftState.list = payload;
        })
      )
      .addCase(getUsersErr, (state, { payload }) =>
        produce(state, (draftState) => {
          draftState.error = payload;
          draftState.loading = false;
        })
      );
  }
);
