import { Socket } from "socket.io";
import AppUOW from ".";
import { Event } from "../events";
import { MessageType } from "../models/message";
import { Room, RoomType } from "../models/Room";
import BaseRepo from "./baseRepo";

type SendMessageParams = {
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
    socket.on(Event.JOIN_ROOM, (data: { rooms: Array<number> }) => {
      this.joinRoom(data.rooms);
    });

    socket.on(Event.LEAVE_ROOM, (data: { rooms: Array<number> }) => {
      this.leaveRoom(data.rooms);
    });

    socket.on(
      Event.ROOM_MESSAGE,
      ({
        rooms,
        message,
      }: {
        rooms: Array<number>;
        message: SendMessageParams;
      }) => {
        this.sendMessage(rooms, message);
      }
    );
  }

  async joinRoom(rooms: Array<number>) {
    const { socket } = this.app;
    await this.errorHandler(
      async () => {
        //Todo: validate ownership of all rooms
        this.app.decodeAuthToken();
        rooms.forEach((room) => {
          socket.join(room.toString());
        });

        socket.emit(Event.JOIN_ROOM, { ok: true });
      },
      socket,
      Event.JOIN_ROOM
    );
  }

  async leaveRoom(rooms: Array<number>) {
    const { socket } = this.app;
    await this.errorHandler(
      async () => {
        //Todo: validate ownership of all rooms
        this.app.decodeAuthToken();
        rooms.forEach((room) => {
          socket.leave(room.toString());
        });

        socket.emit(Event.LEAVE_ROOM, { ok: true });
      },
      socket,
      Event.LEAVE_ROOM
    );
  }

  async sendMessage(rooms: Array<number>, msg: SendMessageParams) {
    const { socket } = this.app;
    await this.errorHandler(
      async () => {
        rooms.forEach(async (room) => {
          await this.app.messageRepo.newMessage({
            ...msg,
            roomId: room,
            sender: this.app.decodeAuthToken(),
            read: false,
          });
          // Broadcast incoming message to all users in the room
          // Skip the sender of the message
          socket.broadcast.to(room.toString()).emit(Event.ROOM_MESSAGE, msg);
        });

        socket.emit(Event.ROOM_MESSAGE, { ok: true });
      },
      socket,
      Event.ROOM_MESSAGE
    );
  }

  async newRoom(userIds: Array<number>, type: RoomType, name?: string) {
    const room = await Room.create({
      name,
      type,
    });

    const roomId = room.getDataValue("id") as number;

    await this.app.participants.newParticipants(userIds, roomId);
  }
}
