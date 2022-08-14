import { Op, ScopeOptions } from "sequelize";
import { Socket } from "socket.io";
import { Friend, FriendshipStatus, User } from "../db";
import { Event } from "../events";
import BaseRepo from "./baseRepo";
import { userRepo } from "./userRepo";

export type FriendEntry = {
  id: number;
  status: FriendshipStatus;
  createAt: string;
  updatedAt: string;
  userId: number;
  friendId: number;
};

class FriendRepo extends BaseRepo {
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
  async handleAcceptFriendEvent(
    socket: Socket,
    data: { token: string | null; id: number }
  ) {
    const error = await this.errorHandler(async () => {
      let userId: number = this.decodeAuthToken(data.token);
      const [user, request] = await Promise.all([
        userRepo.getUsersByIds([userId]),
        Friend.findOne({
          where: {
            friendId: userId,
          },
        }),
      ]);
      if (!user) throw new Error("User not found");
      if (!request) throw new Error("Request not found");
      await this.updateStatus(data.id, FriendshipStatus.FRIENDS);
      socket.emit(Event.ACCEPT_FRIEND, { ok: true });
      // Should send notification to his friend
      // Todo: Check if the user is active or now before sending the notification
      let info: FriendEntry = request.get();
      socket.to(info.userId.toString()).emit(Event.NOTIFICATION, {
        type: Event.ACCEPT_FRIEND,
        user: user[0],
        request: info,
      });
    });

    if (error instanceof Error) {
      socket.emit(Event.ACCEPT_FRIEND, {
        error: error.message,
      });
    }
  }
}

export const friendRepo = new FriendRepo();
