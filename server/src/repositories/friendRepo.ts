import { Op } from "sequelize";
import AppUOW from ".";
import { Event } from "../events";
import { Friend, FriendshipStatus, IFriend } from "../models/Friend";
import { RoomType } from "../models/Room";
import { parseQuery } from "../utils/prase";
import BaseRepo from "./baseRepo";

export default class FriendRepo extends BaseRepo {
  constructor(app: AppUOW) {
    super(app);
    this.initListeners();
  }

  initListeners() {
    const { socket } = this.app;
    socket.on(Event.AcceptFriend, this.acceptFriendHandler.bind(this));
    socket.on(Event.RemoveFriend, this.removeFriend.bind(this));
  }

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

  async acceptFriendHandler(friendId: number) {
    const { socket } = this.app;
    await this.errorHandler(
      async () => {
        let userId = this.app.decodeAuthToken();
        if (!friendId) throw new Error("Missing friendId");
        const [user, request] = await Promise.all([
          this.app.userRepo.getUsersById([userId]),
          Friend.findOne({
            where: {
              userId: friendId,
            },
          }),
        ]);
        if (!user) throw new Error("User not found");
        if (!request) throw new Error("Request not found");

        // Create new room with new participants
        let info = request.get();
        let roomId = await this.app.roomRepo.newRoom(
          [info.userId, info.friendId],
          RoomType.DM
        );

        await this.markAsFriends(info.id, roomId);
        socket.emit(Event.AcceptFriend, { friendId });
        // Should send notification to his friend
        // Todo: Check if the user is active or now before sending the notification
        socket.to(info.userId.toString()).emit(Event.Notification, {
          type: Event.AcceptFriend,
          user: user[0],
          request: info,
        });
      },
      Event.AcceptFriend,
      { friendId }
    );
  }

  async removeFriend(friendId: number) {
    const { socket } = this.app;
    await this.errorHandler(
      async () => {
        let userId = this.app.decodeAuthToken();
        const query = await Friend.findOne({
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

        const friend = parseQuery<IFriend>(query);
        await this.app.roomRepo.deletById(friend.roomId);
        await this.deleteById(friend.id);

        socket.emit(Event.RemoveFriend, { friendId });
      },
      Event.RemoveFriend,
      { friendId }
    );
  }

  async deleteById(id: number) {
    await Friend.destroy({
      where: {
        id,
      },
    });
  }
}
