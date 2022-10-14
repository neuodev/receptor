import { createAction } from "@reduxjs/toolkit";
import { IMessage, RoomId } from "./reducer";

export const getRoomMessagesReq = createAction<RoomId>("room-messages/req");
export const getRoomMessagesErr = createAction<{
  roomId: RoomId;
  error: string;
}>("room-messages/err");
export const getRoomMessagesRes = createAction<{
  roomId: RoomId;
  messages: IMessage[];
}>("room-messages/res");

export const setCrrRoom = createAction<RoomId | null>("room/set-current");
