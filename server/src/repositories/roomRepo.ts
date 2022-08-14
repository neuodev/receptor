import { Socket } from "socket.io";
import { Event } from "../events";
import BaseRepo from "./baseRepo";

class RoomRepo extends BaseRepo {
  async joinRoom(
    socket: Socket,
    data: { rooms: Array<number>; token: string | null }
  ) {
    await this.errorHandler(
      async () => {
        //Todo: validate ownership of all rooms
        this.decodeAuthToken(data.token);
        data.rooms.forEach((room) => {
          socket.join(room.toString());
        });

        socket.emit(Event.JOIN_ROOM, { ok: true });
      },
      socket,
      Event.JOIN_ROOM
    );
  }

  async leaveRoom(
    socket: Socket,
    data: { rooms: Array<number>; token: string | null }
  ) {
    await this.errorHandler(
      async () => {
        //Todo: validate ownership of all rooms
        this.decodeAuthToken(data.token);
        data.rooms.forEach((room) => {
          socket.leave(room.toString());
        });

        socket.emit(Event.LEAVE_ROOM, { ok: true });
      },
      socket,
      Event.LEAVE_ROOM
    );
  }

  async sendMessage(
    socket: Socket,
    data: { rooms: Array<number>; token: string | null; message: any }
  ) {
    data.rooms.forEach((room) => {
      socket.to(room.toString()).emit(Event.ROOM_MESSAGE, data.message);
    });

    socket.emit(Event.ROOM_MESSAGE, { ok: true });
  }
}

export const roomRepo = new RoomRepo();