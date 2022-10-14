import axios from "axios";
import { getEndpoint } from "../../constants/api";
import { IMessage, RoomId } from "../../state/messages/reducer";
import { useAuthHeaders } from "../../state/user/hooks";

export const useRoomApi = () => {
  const headers = useAuthHeaders();

  async function getRoomMessages(roomId: RoomId): Promise<IMessage[]> {
    const { data } = await axios.get<IMessage[]>(
      getEndpoint("getRoomMessages", roomId.toString()),
      {
        headers,
      }
    );
    return data;
  }

  return { getRoomMessages };
};
