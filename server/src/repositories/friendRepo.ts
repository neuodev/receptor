import { Friend, FriendshipStatus } from "../db";
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
}

export const friendRepo = new FriendRepo();
