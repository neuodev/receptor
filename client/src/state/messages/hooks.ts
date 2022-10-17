import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { getErrMsg } from "../../utils/error";
import {
  getRoomMessagesErr,
  getRoomMessagesReq,
  getRoomMessagesRes,
  setCrrRoom,
} from "./actions";
import { MessageType, RoomId } from "./reducer";
import { useRoomApi } from "../../hooks/api/room";
import { useAppSocket } from "../../wss/appSocket";

export const useRoom = () => {
  const dispatch = useAppDispatch();
  const roomApi = useRoomApi();
  const socket = useAppSocket();

  async function getRoomMessages(roomId: RoomId) {
    try {
      dispatch(getRoomMessagesReq(roomId));
      const messages = await roomApi.getRoomMessages(roomId);
      dispatch(getRoomMessagesRes({ roomId, messages }));
    } catch (error) {
      dispatch(getRoomMessagesErr({ roomId, error: getErrMsg(error) }));
    }
  }

  async function setCurrentRoom(roomId: RoomId | null) {
    dispatch(setCrrRoom(roomId));
  }

  async function sendTextMsg(roomId: number, msg: string) {
    socket.sendRoomMsg({
      rooms: [roomId],
      message: {
        type: MessageType.Text,
        body: msg,
      },
    });
  }

  return { getRoomMessages, setCurrentRoom, sendTextMsg };
};
