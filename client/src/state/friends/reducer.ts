import { createReducer } from "@reduxjs/toolkit";
import produce from "immer";
import { IUser } from "../user/reducer";
import {
  getFriendsErr,
  getFriendsReq,
  getFriendsRes,
  updateUser,
} from "./actions";

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
      .addCase(getFriendsReq, (state) =>
        produce(state, (draft) => {
          draft.loading = true;
          draft.error = null;
        })
      )
      .addCase(getFriendsErr, (state, { payload }) =>
        produce(state, (draft) => {
          draft.loading = false;
          draft.error = payload;
        })
      )
      .addCase(getFriendsRes, (state, { payload }) =>
        produce(state, (draft) => {
          draft.loading = false;
          draft.error = null;
          draft.list = payload;
        })
      )
      .addCase(updateUser, (state, { payload: newUser }) =>
        produce(state, (draftState) => {
          draftState.list.forEach((friend) => {
            friend.user = friend.user.id === newUser.id ? newUser : friend.user;
          });
        })
      );
  }
);
