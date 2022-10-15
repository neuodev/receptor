import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Event, socket } from ".";
import { ROUTES } from "../constants/routes";
import { useRoomApi } from "../hooks/api/room";
import { addFriendErr, addFriendRes } from "../state/addFriend/actions";
import {
  getRoomMessagesErr,
  getRoomMessagesRes,
} from "../state/messages/actions";
import { MessageType, RoomId } from "../state/messages/reducer";
import { useAppDispatch, useAppSelector } from "../store";
import { getErrMsg } from "../utils/error";

export type SendRoomMsg = {
  rooms: RoomId[];
  message: {
    type: MessageType;
    body: string;
  };
};

export const useServerEvents = () => {
  const authToken = useAppSelector((state) => state.user.authToken);
  const { login } = useAppScoket();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loc = useLocation();
  const roomApi = useRoomApi();

  useEffect(() => {
    socket.on(Event.Login, () => {
      console.count("login");
      if (loc.pathname === ROUTES.LOG_IN || loc.pathname === ROUTES.REGISTER)
        navigate(ROUTES.ROOT);
    });

    socket.on(Event.AddFriend, (res) => {
      console.count("addFriend");
      if (res.error) {
        dispatch(addFriendErr(res.error));
      } else {
        dispatch(addFriendRes());
      }
    });

    socket.on(Event.JoinRoom, () => {
      console.count("JoinRoom");
    });

    socket.on(Event.RoomMessage, async (res) => {
      console.count("RoomMessage");
      if ("error" in res) {
        console.error({ e: Event.RoomMessage, res });
        return;
      }

      res.rooms.forEach(async (roomId) => {
        try {
          const messages = await roomApi.getRoomMessages(roomId);
          dispatch(getRoomMessagesRes({ roomId, messages }));
        } catch (error) {
          dispatch(getRoomMessagesErr({ roomId, error: getErrMsg(error) }));
        }
      });
    });
  }, []);

  useEffect(() => {
    if (authToken) login(authToken);
  }, [authToken]);
};

export const useAppScoket = () => {
  function addFriend(id: number) {
    socket.emit(Event.AddFriend, { friendId: id });
  }

  function login(token: string) {
    socket.emit(Event.Login, { token });
  }

  function joinRooms(rooms: number[]) {
    socket.emit(Event.JoinRoom, { rooms });
  }

  function sendRoomMsg(msg: SendRoomMsg) {
    socket.emit(Event.RoomMessage, msg);
  }

  return { addFriend, login, joinRooms, sendRoomMsg };
};
