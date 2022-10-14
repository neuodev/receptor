import produce from "immer";
import { createReducer } from "@reduxjs/toolkit";
import {
  getRoomMessagesErr,
  getRoomMessagesReq,
  getRoomMessagesRes,
  setCrrRoom,
} from "./actions";

export type RoomId = number;

export enum MessageType {
  Text = "text",
  Audio = "audio",
  Video = "video",
  Image = "image",
}

export interface IMessage {
  id: RoomId;
  type: MessageType;
  body: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  roomId: number;
}

type State = {
  currRoom: RoomId | null;
  // IDs of the current loading room messages
  loading: {
    [roomId: RoomId]: boolean;
  };
  error: {
    [roomId: RoomId]: string | null;
  };
  messages: {
    [roomId: RoomId]: IMessage[];
  };
};

export const messagesReducer = createReducer<State>(
  {
    currRoom: null,
    loading: {},
    error: {},
    messages: {},
  },
  (builder) => {
    builder
      .addCase(getRoomMessagesReq, (state, { payload }) =>
        produce(state, (draftState) => {
          draftState.loading[payload] = true;
        })
      )
      .addCase(getRoomMessagesErr, (state, { payload: { roomId, error } }) =>
        produce(state, (draftState) => {
          draftState.loading[roomId] = false;
          draftState.error[roomId] = error;
        })
      )
      .addCase(getRoomMessagesRes, (state, { payload: { roomId, messages } }) =>
        produce(state, (draftState) => {
          draftState.loading[roomId] = false;
          draftState.error[roomId] = null;
          draftState.messages[roomId] = messages;
        })
      )
      .addCase(setCrrRoom, (state, { payload }) =>
        produce(state, (draftState) => {
          draftState.currRoom = payload;
        })
      );
  }
);
