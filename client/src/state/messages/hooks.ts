import { useEffect } from "react";
import axios from "axios";
import { getEndpoint } from "../../constants/api";
import { useAppDispatch, useAppSelector } from "../../store";
import { getErrMsg } from "../../utils/error";
import { useAuthHeaders } from "../user/hooks";
import {
  getRoomMessagesErr,
  getRoomMessagesReq,
  getRoomMessagesRes,
  setCrrRoom,
} from "./actions";
import { IMessage, RoomId } from "./reducer";

export const useRoom = () => {
  const dispatch = useAppDispatch();
  const headers = useAuthHeaders();
  const currRoom = useAppSelector((state) => state.messages.currRoom);

  async function getRoomMessages(roomId: RoomId) {
    try {
      dispatch(getRoomMessagesReq(roomId));

      const { data } = await axios.get<IMessage[]>(
        getEndpoint("getRoomMessages", roomId.toString()),
        {
          headers,
        }
      );

      dispatch(getRoomMessagesRes({ roomId, messages: data }));
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
