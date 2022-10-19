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
import { IFriend } from "../friends/reducer";
import { IUser } from "../user/reducer";

export interface IRoom {
  id: number;
  isGroup: boolean;
  name: string;
  email: string | null;
  updatedAt: string;
  createdAt: string;
  participants: Array<IFriend | IUser>;
  isActive: boolean;
}

export const useRoom = () => {
  const dispatch = useAppDispatch();
  const roomApi = useRoomApi();
  const socket = useAppSocket();

  const { currRoomId, friends, groups, user } = useAppSelector((state) => ({
    currRoomId: state.messages.currRoom,
    friends: state.friends,
    groups: state.groups.groups,
    user: state.user.info,
  }));

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

  function getRooms(): IRoom[] {
    const rooms: IRoom[] = [];
    if (user != null) {
      groups.list.forEach((group) => {
        rooms.push({
          id: group.id,
          isGroup: true,
          isActive: false,
          name: group.name,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
          email: null,
          participants: group.participants,
        });
      });

      friends.list.forEach((friend) => {
        rooms.push({
          id: friend.roomId,
          email: friend.email,
          isGroup: false,
          isActive: friend.isActive,
          createdAt: friend.createdAt,
          updatedAt: friend.updatedAt,
          name: friend.username,
          participants: [user, friend],
        });
      });
    }

    return rooms;
  }

  const isCurrentRoom = (id: number) => id === currRoomId;
  const rooms = getRooms();
  const currRoom = rooms.find((room) => room.id === currRoomId) || null;

  return {
    getRoomMessages,
    setCurrentRoom,
    sendTextMsg,
    currRoom,
    rooms,
    loading: groups.loading || friends.loading,
    error: groups.error || friends.error,
    isCurrentRoom,
  };
};
