import { NotificationType, User } from "../db";
import { JsonWebTokenError } from "jsonwebtoken";
import { Op } from "sequelize";

import { Event } from "../events";
import BaseRepo from "./baseRepo";
import AppUOW from ".";
import { FriendshipStatus } from "../models/Friend";

export type UserEntry = {
  username: string;
  password: string;
  isActive: boolean;
  id: number;
};
export type AddFriendMsg = {
  token: string | null;
  friendId: number;
};
export default class UserRepo extends BaseRepo {
  constructor(app: AppUOW) {
    super(app);
    this.initListeners();
  }

  initListeners() {
    const { socket } = this.app;
    socket.on(Event.LOGIN, async (data: { token: string }) => {
      this.app.setAuthToken(data.token);
      this.handleLogin();
    });

    socket.on(Event.ADD_FRIEND, async (data: { friendId: number }) => {
      this.addFriend(data.friendId);
    });

    socket.on(Event.DISCONNECT, () => {
      console.log("here!");
      this.handleDisconnect();
    });
  }

  async registerUser(data: {
    username: string;
    password: string;
    isActive?: boolean;
  }): Promise<string> {
    const user = await User.create(data);
    return user.getDataValue("id") as string;
  }

  async getUsers() {
    return await User.findAll({});
  }

  async getUsersByIds(ids: Array<number>): Promise<Array<UserEntry>> {
    const match = ids.map((id) => ({ id }));
    const users = await User.findAll({
      where: {
        [Op.or]: match,
      },
      attributes: { exclude: ["password"] },
    });

    return users.map((user) => user.get());
  }

  async flush() {
    await User.truncate();
  }

  async getUserById(id: number): Promise<UserEntry | null> {
    const user = await User.findByPk(id);
    return user?.get();
  }

  async getUser(username: string, password: string): Promise<UserEntry | null> {
    let user = await User.findOne({
      where: {
        username,
        password,
      },
      attributes: { exclude: ["password"] },
    });

    return user === null
      ? null
      : (JSON.parse(JSON.stringify(user)) as UserEntry);
  }

  async updateUserStatus(id: number, isActive: boolean) {
    await User.update(
      {
        isActive,
      },
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
          throw new Error("User can't it himself as friend");
        // Check if the user exist
        const users = await this.getUsersByIds([userId, friendId]);
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
            friendship.status === FriendshipStatus.PENDING
              ? "Request already sent"
              : friendship.status === FriendshipStatus.FRIENDS
              ? "Already friends"
              : `You got blocked by ${receiver.username}`
          );

        await this.app.friendRepo.addFriend(
          sender.id,
          receiver.id,
          FriendshipStatus.PENDING
        );

        const isSent =
          await this.app.notificationRepo.isFriendshipRequestAlreadySent(
            sender.id,
            receiver.id
          );
        if (isSent != null) throw new Error("Notification already sent");
        // If the receiver active we should send him a notification!
        if (receiver.isActive) {
          // Should send a notification
          // Every user has its own channel which we can ehco the message into
          socket.to(receiver.id.toString()).emit(Event.NOTIFICATION, {
            type: Event.ACCEPT_FRIEND,
            from: sender,
          });
        }
        // Store a copy of the request into the notifications table
        await this.app.notificationRepo.pushNotification({
          content: {
            userId: sender.id,
          },
          type: NotificationType.FRIENDSHIP_REQUEST,
          userId: receiver.id,
        });
        // Update friends table to be pending
        socket.emit(Event.ADD_FRIEND, { ok: true });
      },
      socket,
      Event.ADD_FRIEND
    );
  }

  async handleLogin() {
    const socket = this.app.socket;

    try {
      const token = this.app.getAuthToken();
      if (token === null) throw new Error("Missing auth token");
      const userId = this.app.userRepo.decodeAuthToken(token);
      await this.updateUserStatus(userId, true);
      socket.emit(Event.LOGIN, { ok: true });
      // Add user to a private room so we can send notifications and other stuff
      socket.join(userId.toString());
    } catch (error) {
      let msg = "Unexpected error";
      if (error instanceof JsonWebTokenError) {
        msg = "Invalid auth token";
      } else if (error instanceof Error) {
        msg = error.message;
      } else if (typeof error === "string") {
        msg = error;
      }
      socket.emit(Event.LOGIN, { error: msg });
    }
  }

  async handleDisconnect() {
    const { socket } = this.app;
    await this.errorHandler(
      async () => {
        const userId = this.app.decodeAuthToken();
        await this.updateUserStatus(userId, false);
      },
      socket,
      Event.DISCONNECT
    );
  }
}
