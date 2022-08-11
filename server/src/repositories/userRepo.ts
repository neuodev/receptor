import { User } from "../db";
import { Socket } from "socket.io";
import { ErrorEvents, Event } from "../events";
import { ValidationError } from "sequelize";
import { sendErrorMsg } from "../utils/error";

export type RegisterUserPramas = {
  username: string;
  password: string;
  isActive?: boolean;
};
export default class UserRepo {
  socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;
  }
  async registerUser(data: RegisterUserPramas) {
    try {
      const user = await User.create(data);
      this.socket.emit(Event.REGISTER, {
        success: true,
        id: user.getDataValue("id"),
      });
    } catch (error) {
      sendErrorMsg(
        error,
        this.socket,
        Event.REGISTER,
        "Unabel to register new user"
      );
    }
  }
}
