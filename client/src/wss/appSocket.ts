import { useEffect } from "react";
import { Event, socket } from ".";
import { addFriendErr, addFriendRes } from "../state/addFriend/actions";
import { updateUser } from "../state/friends/actions";
import { addNewMsg } from "../state/messages/actions";
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
  const authToken = useAppSelector((state) => state.user.authToken);
  const { login } = useAppSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on(Event.Login, () => {
      console.count("login");
    });

    socket.on(Event.AddFriend, (res) => {
      console.group("AddFriend");
      console.count("addFriend");
      console.log(res);
      console.groupEnd();
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
      } else {
        dispatch(addNewMsg(res));
      }
    });

    socket.on(Event.UpdateUser, (user) => {
      console.count("UpdateUser");
      dispatch(updateUser(user));
    });
  }, []);

  useEffect(() => {
    if (authToken) login(authToken);
  }, [authToken]);
};

export const useAppSocket = () => {
  function addFriend(id: number) {
    socket.emit(Event.AddFriend, id);
  }

  function login(token: string) {
    socket.emit(Event.Login, { token });
  }

  function logout() {
    socket.emit(Event.Logout);
  }

  function joinRooms(rooms: number[]) {
    socket.emit(Event.JoinRoom, { rooms });
  }

  function sendRoomMsg(msg: SendRoomMsg) {
    socket.emit(Event.RoomMessage, msg);
  }

  return { addFriend, login, logout, joinRooms, sendRoomMsg };
};
