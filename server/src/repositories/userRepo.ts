import { Event } from "../events";
import BaseRepo from "./baseRepo";
import AppUOW from ".";
import { getUserPrivateRoom } from "../utils/user";
import userUOW from "../database/user";

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

  async handleLogin() {
    const socket = this.app.socket;
    this.errorHandler(async () => {
      const token = this.app.getAuthToken();
      if (token === null) throw new Error("Missing auth token");
      const userId = this.app.userRepo.decodeAuthToken(token);
      await userUOW.updateUserStatus(userId, true);
      socket.emit(Event.Login, { ok: true });
      socket.join(getUserPrivateRoom(userId));
      this.app.friendRepo.notifyFriends(userId);
    }, Event.Login);
  }

  async handleLogout() {
    await this.errorHandler(async () => {
      const userId = this.app.decodeAuthToken();
      await userUOW.updateUserStatus(userId, false);
      await this.app.friendRepo.notifyFriends(userId);
    }, Event.Logout);
  }

  async handleGetUser() {
    const { socket } = this.app;
    await this.errorHandler(async () => {
      const userId = this.app.decodeAuthToken();
      let user = await userUOW.getById(userId);
      socket.emit(Event.GetUser, user);
    }, Event.GetUser);
  }
}
