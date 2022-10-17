import AppUOW from ".";
import { Event } from "../events";
import { MessageType } from "../models/Message";
import { Participants } from "../models/Participants";
import { Room, RoomType } from "../models/Room";
import { parseQuery } from "../utils/prase";
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
    socket.on(Event.JoinRoom, (data: { rooms: Array<number> }) => {
      this.joinRoom(data.rooms);
    });

    socket.on(Event.LeaveRoom, (data: { rooms: Array<number> }) => {
      this.leaveRoom(data.rooms);
    });

    socket.on(
      Event.RoomMessage,
      ({ rooms, message }: { rooms: Array<number>; message: RoomMessage }) => {
        this.sendMessage(rooms, message);
      }
    );
  }

  async joinRoom(rooms: Array<number>) {
    const { socket } = this.app;
    await this.errorHandler(async () => {
      //Todo: validate ownership of all rooms
      this.app.decodeAuthToken();
      rooms.forEach((room) => {
        socket.join(room.toString());
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

  async sendMessage(rooms: Array<number>, msg: RoomMessage) {
    const { socket } = this.app;
    await this.errorHandler(async () => {
      const userId = this.app.decodeAuthToken();
      const user = await this.app.userRepo.getById(userId);
      if (!user) throw new Error("User not found");

      const messages = await Promise.all(
        rooms.map((room) =>
          this.app.messageRepo.newMessage({
            ...msg,
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

        socket.broadcast.to(room.toString()).emit(Event.RoomMessage, msg);
        socket.emit(Event.RoomMessage, msg);
      });
    }, Event.RoomMessage);
  }

  async newRoom(
    userIds: Array<number>,
    type: RoomType,
    name?: string
  ): Promise<number> {
    const room = await Room.create({
      name,
      type,
    });
    const roomId = room.getDataValue("id");
    await this.app.participants.newParticipants(userIds, roomId);
    return roomId;
  }

  async deleteRoomById(id: number) {}
  async deleteFriendRoom(userId: number, friendId: number) {
    const roomIds = await this.app.participants.getUserRoomIds(userId);
    // console.log(roomIds);
    // Find the room
    // Delete the messages
    // Delete the participants
    // Delet the actual room
    const result = await Room.findAll({
      where: {
        participants: {
          userId,
        },
      },
      include: {
        model: Participants,
      },
    });
    const rooms = parseQuery<any>(result);
    console.log(rooms);
  }
}
