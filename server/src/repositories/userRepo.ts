import { NotificationType, User } from "../db";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { Op } from "sequelize";
import { Socket } from "socket.io";
import { Event } from "../events";
import { notificationRepo } from "./notfiRepo";

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
export default class UserRepo {
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

  async addFriend(data: AddFriendMsg, socket: Socket) {
    try {
      // Check if the user exist
      let userId = this.decodeAuthToken(data.token);
      if (!data.friendId) throw new Error("Firend Id is missing");
      const users = await this.getUsersByIds([userId, data.friendId]);
      const sender = users.find((user) => user.id === userId);
      const receiver = users.find((user) => user.id === data.friendId);

      if (!sender) throw new Error("User doesn't exist");
      if (!receiver) throw new Error("Receiver no longer exist");

      const isSent = await notificationRepo.isFriendshipRequestAlreadySent(
        sender.id,
        receiver.id
      );

      if (isSent !== null) throw new Error("Notification already sent");
      // If the receiver active we should send him a notification!
      if (receiver.isActive) {
        // Should send a notification
      }
      // Store a copy of the request into the notifications table
      await notificationRepo.pushNotification({
        content: {
          userId: sender.id,
        },
        type: NotificationType.FRIENDSHIP_REQUEST,
        userId: receiver.id,
      });

      // Update friends table to be pending

      socket.emit(Event.ADD_FRIEND, { ok: true });
    } catch (error) {
      let msg;
      if (error instanceof JsonWebTokenError) {
        msg = "Invalid auth token";
      } else if (error instanceof Error) {
        msg = error.message;
      }

      socket.emit(Event.ADD_FRIEND, { error: msg });
    }
  }

  decodeAuthToken(token: string | null): number {
    let secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is missing");
    if (token === null) throw new Error("Missing auth token");
    let result = jwt.verify(token, secret);

    return (result as { id: number }).id as number;
  }

  async handleLogin(socket: Socket, token: string | null) {
    try {
      if (token === null) throw new Error("Missing auth token");
      const userId = userRepo.decodeAuthToken(token);
      await this.updateUserStatus(userId, true);
      socket.emit(Event.LOGIN, { ok: true });
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
}

export const userRepo = new UserRepo();
