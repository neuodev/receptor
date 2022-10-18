import { IUser, User } from "../models/User";
import { Op } from "sequelize";
import { Event } from "../events";
import BaseRepo from "./baseRepo";
import AppUOW from ".";
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
    socket.on(Event.Login, async (token) => {
      this.app.setAuthToken(token);
      this.handleLogin();
    });
    socket.on(Event.Disconnect, this.handleLogout.bind(this));
    socket.on(Event.Logout, this.handleLogout.bind(this));
    socket.on(Event.GetUser, this.handleGetUser.bind(this));
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

  async getAll() {
    return await User.findAll({});
  }

  async getByIds(ids: Array<number>): Promise<Array<IUser>> {
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

  async handleGetUser() {
    const { socket } = this.app;
    await this.errorHandler(async () => {
      const userId = this.app.decodeAuthToken();
      let user = await this.getById(userId);
      socket.emit(Event.GetUser, user);
    }, Event.GetUser);
  }

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
