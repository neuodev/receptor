import { createReducer } from "@reduxjs/toolkit";
import { addFriendErr, addFriendReq, addFriendRes } from "./actions";
import produce from "immer";

type State = {
  loading: boolean;
  error: string | null;
  success: boolean;
};

export const friendReducer = createReducer<State>(
  {
    loading: false,
    error: null,
    success: false,
  },
  (builder) => {
    builder
      .addCase(addFriendReq, (state) =>
        produce(state, (draftState) => {
          draftState = {
            loading: true,
            error: null,
            success: false,
          };
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
  }
);
