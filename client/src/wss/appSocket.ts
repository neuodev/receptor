import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Event, socket } from ".";
import { ROUTES } from "../constants/routes";
import { addFriendErr, addFriendRes } from "../state/addFriend/actions";
import { MessageType, RoomId } from "../state/messages/reducer";
import { useAppDispatch, useAppSelector } from "../store";

export type SendRoomMsg = {
  rooms: RoomId[];
  message: {
    type: MessageType;
    body: string;
  };
};

export const useServerEvents = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    socket.once(Event.Login, () => {
      navigate(ROUTES.ROOT);
    });

    socket.once(Event.AddFriend, (res) => {
      if (res.error) {
        dispatch(addFriendErr(res.error));
      } else {
        dispatch(addFriendRes());
      }
    });

    socket.once(Event.JoinRoom, (res) => {
      console.log({ event: Event.JoinRoom, res });
    });

    socket.once(Event.RoomMessage, (res) => {
      console.log({ res, event: Event.RoomMessage });
    });
  }, []);
};

export const useAppScoket = () => {
  const authToken = useAppSelector((state) => state.user.authToken);
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

  useEffect(() => {
    if (authToken) login(authToken);
  }, [authToken]);

  return { addFriend, login, joinRooms, sendRoomMsg };
};
