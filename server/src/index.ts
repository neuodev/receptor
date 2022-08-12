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
    // Prevent adding friends twice
    await userRepo.addFriend({ ...msg, token: authToken }, socket);
  });

  socket.on(Event.ACCEPT_FRIEND, async (msg: string) => {});
});

app.use(express.json());
app.use("/api/v1", userRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.green.underline.bold)
);
