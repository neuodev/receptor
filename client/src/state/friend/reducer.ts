import { createReducer } from "@reduxjs/toolkit";
import { addFriendErr, addFriendReq, addFriendRes } from "./actions";
import produce from "immer";
import { clone } from "../../utils";

export type UserId = number;
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
    .addCase(addFriendReq, (state, { payload: userId }) =>
      produce(state, (draftState) => {
        draftState.add.loading[userId] = true;
        draftState.add.error[userId] = null;
      })
    )
    .addCase(addFriendRes, (state, { payload: userId }) =>
      produce(state, (draftState) => {
        draftState.add.loading[userId] = false;
        draftState.add.error[userId] = null;
      })
    )
    .addCase(addFriendErr, (state, { payload: { userId, error } }) =>
      produce(state, (draftState) => {
        draftState.add.loading[userId] = false;
        draftState.add.error[userId] = error;
      })
    );
});
