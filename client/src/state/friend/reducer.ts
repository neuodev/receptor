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
    [key: UserId]: boolean;
  };
  success: {
    [key: UserId]: boolean;
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
  success: {},
};

const initalState = {
  add: clone(baseState),
  accept: clone(baseState),
  remove: clone(baseState),
};

export const friendReducer = createReducer<State>(initalState, (builder) => {
  builder
    .addCase(addFriendReq, (state) =>
      produce(state, (draftState) => {
        draftState.add.loading = true;
        draftState.add.error = null;
      })
    )
    .addCase(addFriendRes, (state) =>
      produce(state, (draftState) => {
        draftState = {
          loading: false,
          error: null,
          success: true,
        };
      })
    )
    .addCase(addFriendErr, (state, { payload }) =>
      produce(state, (draftState) => {
        draftState = {
          loading: false,
          error: payload,
          success: false,
        };
      })
    );
});
