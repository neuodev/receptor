import { Socket } from "socket.io";
import { Event } from "../events";
import BaseRepo from "./baseRepo";

class RoomRepo extends BaseRepo {
  async joinRoom(socket: Socket, rooms: Array<number>) {
    rooms.forEach((room) => {
      socket.join(room.toString());
    });

    socket.emit(Event.JOIN_ROOM, { ok: true });
  }
}

export const roomRepo = new RoomRepo();
