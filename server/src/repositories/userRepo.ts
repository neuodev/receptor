import { IUser, User } from "../models/User";
import { Op } from "sequelize";
import { Event } from "../events";
import BaseRepo from "./baseRepo";
import AppUOW from ".";
import { FriendshipStatus } from "../models/Friend";
import { NotificationType } from "../models/Notification";
import { getUserPrivateRoom } from "../utils/user";

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
    socket.on(Event.Login, async (data: { token: string }) => {
      this.app.setAuthToken(data.token);
      this.handleLogin();
    });

    socket.on(Event.AddFriend, this.addFriend.bind(this));

    socket.on(Event.Disconnect, this.handleLogout.bind(this));
    socket.on(Event.Logout, this.handleLogout.bind(this));
    socket.on(Event.GetUser, this.handleGetUser);
  }

  async registerUser(data: {
    username: string;
    password: string;
    email: string;
    isActive?: boolean;
  }): Promise<number> {
    const user = await User.create(data);
    return user.getDataValue("id");
  }

  async getUsers() {
    return await User.findAll({});
  }

  async getUsersById(ids: Array<number>): Promise<Array<IUser>> {
    const match = ids.map((id) => ({ id }));
    const users = await User.findAll({
      where: {
        [Op.or]: match,
      },
      attributes: { exclude: ["password"] },
    });

    return users.map((user) => user.get());
  }

  async getById(id: number): Promise<IUser | null> {
    const user = await User.findOne({
      where: {
        id,
      },
    });

    return user ? user.get() : null;
  }

  async flush() {
    await User.truncate();
  }

  async getUser(username: string, password: string): Promise<IUser | null> {
    let user = await User.findOne({
      where: {
        username,
        password,
      },
      attributes: { exclude: ["password"] },
    });

    return user === null ? null : (JSON.parse(JSON.stringify(user)) as IUser);
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
    await this.errorHandler(async () => {
      let userId = this.app.decodeAuthToken();
      if (!friendId) throw new Error("Firend Id is missing");
      if (userId === friendId)
        throw new Error("User can't add himself as a friend");
      // Check if the user exist
      const users = await this.getUsersById([userId, friendId]);
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

      await this.app.friendRepo.addFriend(
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
        // Should send a notification
        // Every user has its own channel which we can ehco the message into
        socket.to(receiver.id.toString()).emit(Event.Notification, {
          type: Event.AcceptFriend,
          from: sender,
        });
      }
      // Store a copy of the request into the notifications table
      await this.app.notificationRepo.pushNotification({
        content: {
          userId: sender.id,
        },
        type: NotificationType.FriendshipRequest,
        userId: receiver.id,
      });
      // Update friends table to be pending
      socket.emit(Event.AddFriend, { ok: true });
    }, Event.AddFriend);
  }

  async handleLogin() {
    const socket = this.app.socket;
    this.errorHandler(async () => {
      const token = this.app.getAuthToken();
      if (token === null) throw new Error("Missing auth token");
      const userId = this.app.userRepo.decodeAuthToken(token);
      await this.updateUserStatus(userId, true);
      socket.emit(Event.Login, { ok: true });
      // Add user to a private room so we can send notifications and other stuff
      socket.join(getUserPrivateRoom(userId));
      // Notify all friends that the user is active
      this.notifyFriends(userId);
    }, Event.Login);
  }

  async handleLogout() {
    await this.errorHandler(async () => {
      const userId = this.app.decodeAuthToken();
      await this.updateUserStatus(userId, false);
      // Notify all friends that the user is offline
      await this.notifyFriends(userId);
    }, Event.Logout);
  }

  handleGetUser = async () => {
    const { socket } = this.app;
    await this.errorHandler(async () => {
      const userId = this.app.decodeAuthToken();
      let user = await this.getById(userId);
      socket.emit(Event.GetUser, user);
    }, Event.GetUser);
  };

  async notifyFriends(userId: number) {
    const { socket } = this.app;
    await this.errorHandler(async () => {
      const user = await this.app.userRepo.getById(userId);
      if (!user) throw new Error("User not found");
      const friends = await this.app.friendRepo.getFriends(user.id);
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
