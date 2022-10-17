import { createReducer } from "@reduxjs/toolkit";
import { setFriendErr, setFriendReq, setFriendRes } from "./actions";
import produce from "immer";
import { clone } from "../../utils";

export type UserId = number;
export enum FriendAction {
  Add = "add",
  Accept = "accept",
  Remove = "remove",
}

type BaseState = {
  loading: {
    [key: UserId]: boolean;
  };
  error: {
    [key: UserId]: string | null;
  };
};

type State = {
  add: BaseState;
  accept: BaseState;
  remove: BaseState;
};
const baseState = {
  loading: {},
  error: {},
};

const initalState = {
  add: clone(baseState),
  accept: clone(baseState),
  remove: clone(baseState),
};

export const friendReducer = createReducer<State>(initalState, (builder) => {
  builder
    .addCase(setFriendReq, (state, { payload: { action, userId } }) =>
      produce(state, (draftState) => {
        draftState[action].loading[userId] = true;
        draftState[action].error[userId] = null;
      })
    )
    .addCase(setFriendRes, (state, { payload: { action, userId } }) =>
      produce(state, (draftState) => {
        draftState[action].loading[userId] = false;
        draftState[action].error[userId] = null;
      })
    )
    .addCase(setFriendErr, (state, { payload: { action, userId, error } }) =>
      produce(state, (draftState) => {
        draftState[action].loading[userId] = false;
        draftState[action].error[userId] = error;
      })
    );
});
