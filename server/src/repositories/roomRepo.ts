import AppUOW from ".";
import { Event } from "../events";
import { MessageType } from "../models/Message";
import { Participants } from "../models/Participants";
import { Room, RoomType } from "../models/Room";
import { parseQuery } from "../utils/prase";
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
    socket.on(Event.CreateGroup, this.createGroup.bind(this));
  }

  async createGroup(name: string, userIds: number[]) {
    const { socket } = this.app;
    await this.errorHandler(async () => {
      const userId = this.app.decodeAuthToken();
      let err: string;
      if (!name) err = "Group name is required";
      if (!userIds || userIds.length === 0)
        err = "Can't create an empty group. At least one member is required";
      const friends = await this.app.friendRepo.getFriends(userId);
      const friendIds = new Set(
        friends
          .map((f) => [f.friendId, f.userId])
          .reduce((acc, curr) => acc.concat(curr), [])
      );

      userIds.forEach((id) => {
        if (!friendIds.has(id))
          throw new Error(`User with id of '${id}' is not a friend`);
      });

      await this.newRoom([...userIds, userId], RoomType.GROUP, name);
      socket.emit(Event.CreateGroup, { ok: true });
    }, Event.CreateGroup);
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
      const user = await this.app.userRepo.getById(userId);
      if (!user) throw new Error("User not found");

      const messages = await Promise.all(
        rooms.map((room) =>
          this.app.messageRepo.newMessage({
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

  async deletById(id: number) {
    // Delete messages -> Participants -> Room
    await this.app.messageRepo.deleteRoommMessages(id);
    await this.app.participants.deleteByRoomId(id);
    await Room.destroy({
      where: {
        id,
      },
    });
  }
}
