import { Op } from "sequelize";
import AppUOW from ".";
import { Event } from "../events";
import { Friend, FriendshipStatus, IFriend } from "../models/Friend";
import { NotificationType } from "../models/Notification";
import { RoomType } from "../models/Room";
import { parseQuery } from "../utils/prase";
import { getUserPrivateRoom } from "../utils/user";
import BaseRepo from "./baseRepo";

export default class FriendRepo extends BaseRepo {
  constructor(app: AppUOW) {
    super(app);
    this.initListeners();
  }

  initListeners() {
    const { socket } = this.app;
    socket.on(Event.AddFriend, this.addFriend.bind(this));
    socket.on(Event.AcceptFriend, this.acceptFriend.bind(this));
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

  async addFriend(friendId: number) {
    const { socket } = this.app;
    await this.errorHandler(
      async () => {
        let userId = this.app.decodeAuthToken();
        if (!friendId) throw new Error("Firend Id is missing");
        if (userId === friendId)
          throw new Error("User can't add himself as a friend");
        // Check if the user exist
        const users = await this.app.userRepo.getByIds([userId, friendId]);
        const sender = users.find((user) => user.id === userId);
        const receiver = users.find((user) => user.id === friendId);
        if (!sender) throw new Error("User doesn't exist");
        if (!receiver) throw new Error("Receiver no longer exist");

        const friendship = await this.app.friendRepo.getFriendshipRecord(
          sender.id,
          receiver.id
        );

        if (friendship)
          throw new Error(
            friendship.status === FriendshipStatus.Pending
              ? "Request already sent"
              : friendship.status === FriendshipStatus.Friends
              ? "Already friends"
              : `You got blocked by ${receiver.username}`
          );

        await this.newFriend(sender.id, receiver.id, FriendshipStatus.Pending);
        const isSent =
          await this.app.notificationRepo.isFriendshipRequestAlreadySent(
            sender.id,
            receiver.id
          );
        if (isSent != null) throw new Error("Notification already sent");
        // If the receiver active we should send him a notification!
        if (receiver.isActive) {
          socket.to(getUserPrivateRoom(receiver.id)).emit(Event.Notification, {
            type: Event.AcceptFriend,
            from: sender,
          });
        }

        await this.app.notificationRepo.pushNotification({
          content: {
            userId: sender.id,
          },
          type: NotificationType.FriendshipRequest,
          userId: receiver.id,
        });

        socket.emit(Event.AddFriend, { friendId });
      },
      Event.AddFriend,
      { friendId }
    );
  }

  async acceptFriend(friendId: number) {
    const { socket } = this.app;
    await this.errorHandler(
      async () => {
        let userId = this.app.decodeAuthToken();
        if (!friendId) throw new Error("Missing friendId");
        const [user, request] = await Promise.all([
          this.app.userRepo.getById(userId),
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
          user,
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
