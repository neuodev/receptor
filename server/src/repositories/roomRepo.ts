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
        data.rooms.forEach((room) => {
          socket.join(room.toString());
        });

        socket.emit(Event.JOIN_ROOM, { ok: true });
      },
      socket,
      Event.JOIN_ROOM
    );
  }
}

export const roomRepo = new RoomRepo();
