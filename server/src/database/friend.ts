import { Op } from "sequelize";
import { Friend, FriendshipStatus, IFriend } from "../models/Friend";

class FriendUOW {
  async getFriend(userId: number, friendId: number): Promise<IFriend | null> {
    const friend = await Friend.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: {
              userId,
              friendId,
            },
          },
          {
            [Op.and]: {
              userId: friendId,
              friendId: userId,
            },
          },
        ],
      },
    });

    return friend ? friend.get() : null;
  }

  async newFriend(userId: number, friendId: number, status: FriendshipStatus) {
    await Friend.create({
      userId,
      friendId,
      status,
    });
  }

  async getFriends(userId: number): Promise<IFriend[]> {
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

  async markAsFriends(id: number, roomId: number) {
    await Friend.update(
      { roomId, status: FriendshipStatus.Friends },
      {
        where: {
          id,
        },
      }
    );
  }

  async deleteById(id: number) {
    await Friend.destroy({
      where: {
        id,
      },
    });
  }

  async getFriendRequest(userId: number): Promise<IFriend | null> {
    const friend = await Friend.findOne({
      where: {
        userId,
      },
    });

    return friend ? friend.get() : null;
  }
}

const friendUOW = new FriendUOW();
export default friendUOW;
