import axios from "axios";
import { API } from "../../constants/api";
import { useAppDispatch } from "../../store";
import { getErrMsg } from "../../utils/error";
import { useAuthHeaders } from "../user/hooks";
import {
  getRoomMessagesErr,
  getRoomMessagesReq,
  getRoomMessagesRes,
} from "./actions";
import { IMessage, RoomId } from "./reducer";

export const useRoom = () => {
  const dispatch = useAppDispatch();
  const headers = useAuthHeaders();

  async function getRoomMessages(roomId: RoomId) {
    try {
      dispatch(getRoomMessagesReq(roomId));

      const { data } = await axios.get<IMessage[]>(
        API.getRoomMessages(roomId),
        {
          headers,
        }
      );

      dispatch(getRoomMessagesRes({ roomId, messages: data }));
    } catch (error) {
      dispatch(getRoomMessagesErr({ roomId, error: getErrMsg(error) }));
    }
  }
  return { getRoomMessages };
};
