import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { getErrMsg } from "../../utils/error";
import {
  getRoomMessagesErr,
  getRoomMessagesReq,
  getRoomMessagesRes,
  setCrrRoom,
} from "./actions";
import { RoomId } from "./reducer";
import { useRoomApi } from "../../hooks/api/room";

export const useRoom = () => {
  const dispatch = useAppDispatch();
  const currRoom = useAppSelector((state) => state.messages.currRoom);
  const roomApi = useRoomApi();

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

  useEffect(() => {
    if (currRoom) getRoomMessages(currRoom);
  }, [currRoom]);

  return { getRoomMessages, setCurrentRoom };
};
