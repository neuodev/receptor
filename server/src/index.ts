import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import "colors";
import { Event } from "./events";
import { userRouter } from "./routes/user";
import { errorHandler } from "./middleware/errorHandler";
import "./seed";
import { AddFriendMsg, userRepo } from "./repositories/userRepo";
import { notificationRepo } from "./repositories/notfiRepo";
import { friendRepo } from "./repositories/friendRepo";

dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.on(Event.CONNECT, (socket: Socket) => {
  let authToken: null | string = null;

  socket.on(Event.LOGIN, async (data: { token: string }) => {
    authToken = data.token;
    await userRepo.handleLogin(socket, authToken);
  });

  socket.on(Event.ADD_FRIEND, async (msg: AddFriendMsg) => {
    await userRepo.addFriend({ ...msg, token: authToken }, socket);
  });

  socket.on(Event.ACCEPT_FRIEND, async (data: { id: number }) => {
    await friendRepo.handleAcceptFriendEvent(socket, {
      token: authToken,
      id: data.id,
    });
  });

  socket.on(Event.NOTIFICATION, async (msg: any) => {
    await notificationRepo.handleNotificationsEvent(socket, authToken);
  });

  //* Chat
  /**
   * Three main events
   * 1. Join Room
   * 2. Message
   *    - Broadcaste + Notif the user that message got sent successfly
   * 3. Leave Room
   */

  socket.on(Event.JOIN_ROOM, () => {
    // Need room id which should crosspond to his friend id
    // Todo: Validate room ids
  });
});

app.use(express.json());
app.use("/api/v1", userRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.green.underline.bold)
);
