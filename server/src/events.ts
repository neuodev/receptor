import { IMessage, MessageType } from "./models/Message";
import { IUser } from "./models/User";

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
}

export type RoomId = number;
export type SendRoomMsg = {
  rooms: RoomId[];
  message: {
    type: MessageType;
    body: string;
  };
};

export type OkOrErr = { ok?: boolean; error?: string };
export type FriendEventRes = { friendId: number; error?: string };

export interface ClientToServerEvents {
  [Event.Login]: (token: string) => void;
  [Event.Logout]: () => void;
  [Event.AddFriend]: (frinedId: number) => void;
  [Event.JoinRoom]: (rooms: number[]) => void;
  [Event.RoomMessage]: (data: SendRoomMsg) => void;
  [Event.AcceptFriend]: (friendId: number) => void;
  [Event.RemoveFriend]: (friendId: number) => void;
}

export interface ServerToClientEvents {
  [Event.Login]: (res: OkOrErr) => void;
  [Event.JoinRoom]: (res: OkOrErr) => void;
  [Event.RoomMessage]: (res: { error: string } | IMessage) => void;
  [Event.UpdateUser]: (res: IUser) => void;
  [Event.AddFriend]: (res: FriendEventRes) => void;
  [Event.AcceptFriend]: (res: FriendEventRes) => void;
  [Event.RemoveFriend]: (res: FriendEventRes) => void;
}
