import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import "colors";
import { Event } from "./events";
import UserRepo, { RegisterUserPramas } from "./repositories/userRepo";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on(Event.CONNECT, (socket) => {
  let userRepo = new UserRepo(socket);

  socket.on(Event.REGISTER, async (data: RegisterUserPramas) => {
    userRepo.registerUser(data);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.green.underline.bold)
);
