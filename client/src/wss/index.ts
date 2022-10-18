import { io, Socket } from "socket.io-client";
import { IMessage } from "../state/messages/reducer";
import { IUser } from "../state/user/reducer";
import { SendRoomMsg } from "./appSocket";

export enum Event {
  Connect = "connect",
  Disconnect = "disconnect",
  AddFriend = "addFriend",
  AcceptFriend = "acceptFriend",
  RemoveFriend = "removeFriend",
  Notification = "notification",
  Login = "login",
  Logout = "logout",
  GetUser = "getUser",
  JoinRoom = "joinRoom",
  LeaveRoom = "leaveRoom",
  RoomMessage = "sendRoomMsg",
  UpdateUser = "updateUser",
  CreateGroup = "createGroup",
}

export type OkOrErr = { ok?: boolean; error?: string };
export type FriendEventRes = { friendId: number; error?: string };

interface ServerToClientEvents {
  [Event.Login]: (res: OkOrErr) => void;
  [Event.JoinRoom]: (res: OkOrErr) => void;
  [Event.RoomMessage]: (res: { error: string } | IMessage) => void;
  [Event.UpdateUser]: (res: IUser) => void;
  [Event.AddFriend]: (res: FriendEventRes) => void;
  [Event.AcceptFriend]: (res: FriendEventRes) => void;
  [Event.RemoveFriend]: (res: FriendEventRes) => void;
  [Event.CreateGroup]: (res: OkOrErr) => void;
}

interface ClientToServerEvents {
  [Event.Login]: (token: string) => void;
  [Event.Logout]: () => void;
  [Event.AddFriend]: (frinedId: number) => void;
  [Event.JoinRoom]: (rooms: number[]) => void;
  [Event.RoomMessage]: (data: SendRoomMsg) => void;
  [Event.AcceptFriend]: (friendId: number) => void;
  [Event.RemoveFriend]: (friendId: number) => void;
  [Event.CreateGroup]: (groupName: string, usersId: number[]) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  (() => {
    let uri = process.env.REACT_APP_SERVER;
    if (!uri) throw new Error("Missing server uri");
    return uri;
  })()
);
