import AppUOW from ".";
import friendUOW from "../database/friend";
import messageUOW from "../database/message";
import participantsUOW from "../database/participant";
import roomUOW from "../database/room";
import userUOW from "../database/user";
import { Event } from "../events";
import { MessageType } from "../models/Message";
import { Role } from "../models/Participants";
import { Room, RoomType } from "../models/Room";
import { getRoomId } from "../utils/user";
import BaseRepo from "./baseRepo";

type RoomMessage = {
  type: MessageType;
  body: string;
  receiver: number;
};

export default class RoomRepo extends BaseRepo {
  constructor(app: AppUOW) {
    super(app);
    this.initListeners();
  }

  initListeners() {
    const { socket } = this.app;
    socket.on(Event.JoinRoom, this.joinRoom.bind(this));
    socket.on(Event.LeaveRoom, this.leaveRoom.bind(this));
    socket.on(Event.RoomMessage, this.sendMessage.bind(this));
  }

  async joinRoom(roomIds: number[]) {
    const { socket } = this.app;
    await this.errorHandler(async () => {
      //Todo: validate ownership of all rooms
      this.app.decodeAuthToken();
      roomIds.forEach((room) => {
        socket.join(getRoomId(room));
      });

      socket.emit(Event.JoinRoom, { ok: true });
    }, Event.JoinRoom);
  }

  async leaveRoom(rooms: Array<number>) {
    const { socket } = this.app;
    await this.errorHandler(async () => {
      //Todo: validate ownership of all rooms
      this.app.decodeAuthToken();
      rooms.forEach((room) => {
        socket.leave(room.toString());
      });

      socket.emit(Event.LeaveRoom, { ok: true });
    }, Event.LeaveRoom);
  }

  async sendMessage({
    rooms,
    message,
  }: {
    rooms: Array<number>;
    message: RoomMessage;
  }) {
    const { socket } = this.app;
    await this.errorHandler(async () => {
      const userId = this.app.decodeAuthToken();
      const user = await userUOW.getById(userId);
      if (!user) throw new Error("User not found");

      const messages = await Promise.all(
        rooms.map((room) =>
          messageUOW.newMessage({
            ...message,
            roomId: room,
            userId,
            read: false,
          })
        )
      );

      rooms.forEach(async (room, idx) => {
        // Broadcast incoming message to all users in the room
        // Skip the sender of the message
        // Todo: Add response types
        const msg = {
          ...messages[idx],
          userId: undefined, // Should be removed
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            isActive: user.isActive,
          },
        };

        socket.broadcast.to(getRoomId(room)).emit(Event.RoomMessage, msg);
        socket.emit(Event.RoomMessage, msg);
      });
    }, Event.RoomMessage);
  }

  async newRoom(
    users: Array<{ id: number; role: Role }>,
    type: RoomType,
    name?: string
  ): Promise<number> {
    const roomId = await roomUOW.newRoom(type, name);
    await participantsUOW.newParticipants(users, roomId);
    return roomId;
  }

  async deletById(id: number) {
    // Delete messages -> Participants -> Room
    await messageUOW.deleteRoomMessages(id);
    await participantsUOW.deleteRoomMembers(id);
    await roomUOW.deleteById(id);
  }
}
