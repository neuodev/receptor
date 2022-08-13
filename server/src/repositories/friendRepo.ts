import { Op, ScopeOptions } from "sequelize";
import { Socket } from "socket.io";
import { Friend, FriendshipStatus, User } from "../db";
import { Event } from "../events";
import BaseRepo from "./baseRepo";

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
      this.decodeAuthToken(data.token);
      await this.updateStatus(data.id, FriendshipStatus.FRIENDS);

      socket.emit(Event.ACCEPT_FRIEND, { ok: true });
    });
  }
}

export const friendRepo = new FriendRepo();
