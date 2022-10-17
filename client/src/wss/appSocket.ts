import { useEffect } from "react";
import { Event, socket } from ".";
import { updateUser } from "../state/friends/actions";
import { addNewMsg, resetMessages } from "../state/messages/actions";
import { MessageType, RoomId } from "../state/messages/reducer";
import { useUsers } from "../state/users/hooks";
import { useAppDispatch, useAppSelector } from "../store";
import { logGroup } from "../utils/log";

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
  const { getUsers } = useUsers();
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on(Event.Login, () => {
      console.count("login");
    });

    socket.on(Event.JoinRoom, () => {
      console.count("JoinRoom");
    });

    socket.on(Event.RoomMessage, async (res) => {
      logGroup(Event.RoomMessage, res);
      if ("error" in res) {
        console.error({ e: Event.RoomMessage, res });
      } else {
        dispatch(addNewMsg(res));
      }
    });

    socket.on(Event.UpdateUser, (user) => {
      logGroup(Event.UpdateUser, user);
      dispatch(updateUser(user));
    });

    socket.on(Event.AddFriend, async (res) => {
      logGroup(Event.AddFriend, res);
      await getUsers();
      dispatch(resetMessages());
    });

    socket.on(Event.AcceptFriend, async (res) => {
      logGroup(Event.AcceptFriend, res);
      await getUsers();
      dispatch(resetMessages());
    });
    socket.on(Event.RemoveFriend, async (res) => {
      logGroup(Event.RemoveFriend, res);
      await getUsers();
      dispatch(resetMessages());
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

  function acceptFriend(id: number) {
    socket.emit(Event.AcceptFriend, id);
  }

  function removeFriend(id: number) {
    socket.emit(Event.RemoveFriend, id);
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

  return {
    addFriend,
    login,
    logout,
    joinRooms,
    sendRoomMsg,
    acceptFriend,
    removeFriend,
  };
};
