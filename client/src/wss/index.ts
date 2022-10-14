import { io, Socket } from "socket.io-client";
import { RoomId } from "../state/messages/reducer";
import { SendRoomMsg } from "./appSocket";

export enum Event {
  Connect = "connect",
  Disconnect = "disconnect",
  AddFriend = "AddFriend",
  AcceptFriend = "AcceptFriend",
  Notification = "notification",
  Login = "login",
  GetUser = "getUser",
  JoinRoom = "joinRoom",
  LeaveRoom = "leaveRoom",
  RoomMessage = "sendRoomMsg",
}

type OkOrErr = { ok?: boolean; error?: string };

interface ServerToClientEvents {
  [Event.Login]: (data: OkOrErr) => void;
  [Event.AddFriend]: (data: OkOrErr) => void;
  [Event.JoinRoom]: (data: OkOrErr) => void;
  [Event.RoomMessage]: (data: { rooms: RoomId[] } | { error: string }) => void;
}

interface ClientToServerEvents {
  [Event.Login]: (data: { token: string }) => void;
  [Event.AddFriend]: (data: { friendId: number }) => void;
  [Event.JoinRoom]: (data: { rooms: number[] }) => void;
  [Event.RoomMessage]: (data: SendRoomMsg) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  (() => {
    let uri = process.env.REACT_APP_SERVER;
    if (!uri) throw new Error("Missing server uri");
    return uri;
  })()
);
