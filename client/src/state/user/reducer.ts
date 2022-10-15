import { createReducer } from "@reduxjs/toolkit";
import produce from "immer";
import { authUserErr, authUserInfo, authUserReq, userLogout } from "./actions";

export interface IUser {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type UserState = {
  loading: boolean;
  error: string | null;
  info: IUser | null;
  authToken: string | null;
};

const initState = {
  loading: false,
  error: null,
  info: null,
  authToken: null,
};

export const userReducer = createReducer<UserState>(
  {
    ...initState,
  },
  (builder) => {
    builder
      .addCase(authUserReq, (state, { payload }) =>
        produce(state, (draft) => {
          draft.loading = true;
          draft.error = null;
        })
      )
      .addCase(authUserErr, (state, { payload }) =>
        produce(state, (draft) => {
          draft.loading = false;
          draft.error = payload;
        })
      )
      .addCase(authUserInfo, (state, { payload }) =>
        produce(state, (draft) => {
          draft.error = null;
          draft.loading = false;
          draft.info = payload.user;
          draft.authToken = payload.token;
        })
      )
      .addCase(userLogout, () => initState);
  }
);
