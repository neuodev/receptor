import { useEffect } from "react";
import { Event, socket } from ".";
import { useFriend } from "../state/friend/hooks";
import { updateUser } from "../state/friends/actions";
import { addNewMsg } from "../state/messages/actions";
import { MessageType, RoomId } from "../state/messages/reducer";
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
  const { handleAddFreindRes, handleAcceptFriendRes, handleRemoveFriendRes } =
    useFriend();
  const dispatch = useAppDispatch();

  useEffect(() => {
    [
      Event.Login,
      Event.JoinRoom,
      Event.RoomMessage,
      Event.UpdateUser,
      Event.AddFriend,
      Event.AcceptFriend,
      Event.RemoveFriend,
    ].forEach((e: any) => {
      socket.off(e);
    });

    socket.on(Event.Login, (res) => {
      logGroup(Event.Login, res);
    });

    socket.on(Event.JoinRoom, (res) => {
      logGroup(Event.JoinRoom, res);
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

    socket.on(Event.AddFriend, (res) => {
      logGroup(Event.AddFriend, res);
      handleAddFreindRes(res);
    });

    socket.on(Event.AcceptFriend, async (res) => {
      logGroup(Event.AcceptFriend, res);
      handleAcceptFriendRes(res);
    });

    socket.on(Event.RemoveFriend, async (res) => {
      logGroup(Event.RemoveFriend, res);
      handleRemoveFriendRes(res);
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
    socket.emit(Event.Login, token);
  }

  function logout() {
    socket.emit(Event.Logout);
  }

  function joinRooms(rooms: number[]) {
    socket.emit(Event.JoinRoom, rooms);
  }

  function sendRoomMsg(msg: SendRoomMsg) {
    socket.emit(Event.RoomMessage, msg);
  }

  function createGroup(name: string, usersId: number[]) {
    socket.emit(Event.CreateGroup, name, usersId);
  }

  return {
    addFriend,
    login,
    logout,
    joinRooms,
    sendRoomMsg,
    acceptFriend,
    removeFriend,
    createGroup,
  };
};
