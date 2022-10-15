import { createReducer } from "@reduxjs/toolkit";
import produce from "immer";
import { IUser } from "../user/reducer";
import {
  getFriendsErr,
  getFriendsReq,
  getFriendsRes,
  resetFriends,
  updateUser,
} from "./actions";

export type IFriend = IUser & { roomId: number };

type State = {
  loading: boolean;
  error: string | null;
  list: IFriend[];
};

const initalState: State = {
  loading: false,
  error: null,
  list: [],
};

export const friendsReducer = createReducer<State>(
  produce(initalState, () => {}),
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
      .addCase(updateUser, (state, { payload: newFriend }) =>
        produce(state, (draftState) => {
          draftState.list = draftState.list.map((friend) =>
            friend.id === newFriend.id
              ? { ...newFriend, roomId: friend.roomId }
              : friend
          );
        })
      )
      .addCase(resetFriends, () => produce(initalState, () => {}));
  }
);
