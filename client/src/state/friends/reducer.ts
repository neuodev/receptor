import { createReducer } from "@reduxjs/toolkit";
import { IUser } from "../user/reducer";
import { getFriendsErr, getFriendsReq, getFriendsRes } from "./actions";

type State = {
  loading: boolean;
  error: string | null;
  list: Array<{ roomId: number; user: IUser }>;
};

export const friendsReducer = createReducer<State>(
  {
    loading: false,
    error: null,
    list: [],
  },
  (builder) => {
    builder
      .addCase(getFriendsReq, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(getFriendsErr, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
      }))
      .addCase(getFriendsRes, (state, { payload }) => ({
        loading: false,
        error: null,
        list: payload,
      }));
  }
);
