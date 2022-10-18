import AppUOW from ".";
import friendUOW from "../database/friend";
import userUOW from "../database/user";
import { Event } from "../events";
import { FriendshipStatus } from "../models/Friend";
import { NotificationType } from "../models/Notification";
import { Role } from "../models/Participants";
import { RoomType } from "../models/Room";
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

  async addFriend(friendId: number) {
    const { socket } = this.app;
    await this.errorHandler(
      async () => {
        let userId = this.app.decodeAuthToken();
        if (!friendId) throw new Error("Firend Id is missing");
        if (userId === friendId)
          throw new Error("User can't add himself as a friend");
        // Check if the user exist
        const users = await userUOW.getByIds([userId, friendId]);
        const sender = users.find((user) => user.id === userId);
        const receiver = users.find((user) => user.id === friendId);
        if (!sender) throw new Error("User doesn't exist");
        if (!receiver) throw new Error("Receiver no longer exist");

        const friendship = await friendUOW.getFriend(sender.id, receiver.id);

        if (friendship)
          throw new Error(
            friendship.status === FriendshipStatus.Pending
              ? "Request already sent"
              : friendship.status === FriendshipStatus.Friends
              ? "Already friends"
              : `You got blocked by ${receiver.username}`
          );

        await friendUOW.newFriend(
          sender.id,
          receiver.id,
          FriendshipStatus.Pending
        );
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
          userUOW.getById(userId),
          friendUOW.getFriendRequest(friendId),
        ]);
        if (!user) throw new Error("User not found");
        if (!request) throw new Error("Request not found");

        // Create new room with new participants
        let roomId = await this.app.roomRepo.newRoom(
          [request.userId, request.friendId].map((id) => ({
            id,
            role: Role.Admin,
          })),
          RoomType.DM
        );

        await friendUOW.markAsFriends(request.id, roomId);
        socket.emit(Event.AcceptFriend, { friendId });
        // Should send notification to his friend
        // Todo: Check if the user is active or now before sending the notification
        socket.to(getUserPrivateRoom(request.userId)).emit(Event.Notification, {
          type: Event.AcceptFriend,
          user,
          request,
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
        const friend = await friendUOW.getFriend(userId, friendId);
        if (!friend) throw new Error("Friend not found");
        await this.app.roomRepo.deletById(friend.roomId);
        await friendUOW.deleteById(friend.id);
        socket.emit(Event.RemoveFriend, { friendId });
      },
      Event.RemoveFriend,
      { friendId }
    );
  }

  async notifyFriends(userId: number) {
    const { socket } = this.app;
    await this.errorHandler(async () => {
      const user = await userUOW.getById(userId);
      if (!user) throw new Error("User not found");
      const friends = await friendUOW.getFriends(user.id);
      socket.broadcast
        .to(
          friends
            .map((f) => [
              getUserPrivateRoom(f.userId),
              getUserPrivateRoom(f.friendId),
            ])
            .reduce((acc, curr) => acc.concat(curr), [])
        )
        .emit(Event.UpdateUser, user);
    }, Event.UpdateUser);
  }
}
