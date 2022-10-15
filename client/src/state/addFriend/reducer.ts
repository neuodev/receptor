import { createReducer } from "@reduxjs/toolkit";
import { IUser } from "../user/reducer";
import {
  addFriendErr,
  addFriendReq,
  addFriendRes,
  getUsersErr,
  getUsersReq,
  getUsersRes,
} from "./actions";

export enum UsersRelation {
  Friends = "friends",
  NotFriends = "not-friends",
  PendingRequest = "pending-request",
  PendingResponse = "pending-response",
}

type State = {
  usersList: {
    loading: boolean;
    error: string | null;
    users: Array<IUser & { relation: UsersRelation }>;
  };
  addFriend: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
};

export const addFriendReducer = createReducer<State>(
  {
    usersList: {
      loading: false,
      error: null,
      users: [],
    },
    addFriend: {
      loading: false,
      error: null,
      success: false,
    },
  },
  (builder) => {
    builder
      .addCase(getUsersReq, (state) => ({
        ...state,
        usersList: {
          loading: true,
          error: null,
          users: [],
        },
      }))
      .addCase(getUsersRes, (state, { payload }) => ({
        ...state,
        usersList: {
          loading: false,
          error: null,
          users: payload,
        },
      }))
      .addCase(getUsersErr, (state, { payload }) => ({
        ...state,
        usersList: {
          loading: false,
          error: payload,
          users: state.usersList.users,
        },
      }))
      .addCase(addFriendReq, (state) => ({
        ...state,
        addFriend: {
          loading: true,
          error: null,
          success: false,
        },
      }))
      .addCase(addFriendRes, (state) => ({
        ...state,
        addFriend: {
          loading: false,
          error: null,
          success: true,
        },
      }))
      .addCase(addFriendErr, (state, { payload }) => ({
        ...state,
        addFriend: {
          loading: false,
          error: payload,
          success: false,
        },
      }));
  }
);
