import { Op } from "sequelize";
import { Event } from "../events";
import { Friend, FriendshipStatus } from "../models/Friend";
import { RoomType } from "../models/Room";
import BaseRepo from "./baseRepo";

export type FriendEntry = {
  id: number;
  status: FriendshipStatus;
  createAt: string;
  updatedAt: string;
  userId: number;
  friendId: number;
};

export default class FriendRepo extends BaseRepo {
  async getFriendshipRecord(userId: number, friendId: number) {
    const result = await Friend.findOne({
      where: {
        userId,
        friendId,
      },
    });

    if (!result) return null;
    return result.get();
  }

  async addFriend(userId: number, friendId: number, status: FriendshipStatus) {
    await Friend.create({
      userId,
      friendId,
      status,
    });
  }

  async getFriends(userId: number) {
    let friends = await Friend.findAll({
      where: {
        [Op.or]: {
          userId,
          friendId: userId,
        },
      },
    });

    return friends.map((f) => f.get());
  }

  async updateStatus(id: number, status: FriendshipStatus) {
    await Friend.update(
      { status },
      {
        where: {
          id,
        },
      }
    );
  }

  // Todo: Update this handler to be more generic to handle blocking / accepting frinedship
  async handleAcceptFriendEvent(id: number) {
    const { socket } = this.app;
    await this.errorHandler(
      async () => {
        let userId: number = this.app.decodeAuthToken();
        const [user, request] = await Promise.all([
          this.app.userRepo.getUsersByIds([userId]),
          Friend.findOne({
            where: {
              friendId: userId,
            },
          }),
        ]);
        if (!user) throw new Error("User not found");
        if (!request) throw new Error("Request not found");
        // Create new room with new participants
        let info: FriendEntry = request.get();
        await this.app.roomRepo.newRoom(
          [info.userId, info.friendId],
          RoomType.DM
        );

        await this.updateStatus(id, FriendshipStatus.FRIENDS);
        socket.emit(Event.AcceptFriend, { ok: true });
        // Should send notification to his friend
        // Todo: Check if the user is active or now before sending the notification
        socket.to(info.userId.toString()).emit(Event.Notification, {
          type: Event.AcceptFriend,
          user: user[0],
          request: info,
        });
      },
      socket,
      Event.AcceptFriend
    );
  }
}
