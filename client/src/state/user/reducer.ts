import { createReducer } from "@reduxjs/toolkit";
import {
  authUserErr,
  authUserInfo,
  authUserReq,
  setUserFriends,
} from "./actions";

export interface IUser {
  id: number;
  username: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type UserState = {
  loading: boolean;
  error: string | null;
  info: IUser | null;
  authToken: string | null;
  roomIds: number[];
  friends: Array<{ roomId: number; user: IUser }>;
};

export const userReducer = createReducer<UserState>(
  {
    loading: false,
    error: null,
    info: null,
    authToken: null,
    roomIds: [],
    friends: [],
  },
  (builder) => {
    builder
      .addCase(authUserReq, (state, { payload }) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(authUserErr, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
      }))
      .addCase(authUserInfo, (state, { payload }) => ({
        ...state,
        loading: false,
        error: null,
        info: payload.user,
        authToken: payload.token,
      }))
      .addCase(setUserFriends, (state, { payload }) => ({
        ...state,
        loading: false,
        error: null,
        friends: payload.friends,
        roomIds: payload.rooms,
      }));
  }
);
