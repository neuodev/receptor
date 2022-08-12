import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import "colors";
import { Event } from "./events";
import { RegisterUserPramas } from "./repositories/userRepo";
import { userRouter } from "./routes/user";
import { errorHandler } from "./middleware/errorHandler";
import "./seed";

dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.on(Event.CONNECT, (socket) => {
  socket.on(Event.REGISTER, async (data: RegisterUserPramas) => {});
});

app.use(express.json());
app.use("/api/v1", userRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.green.underline.bold)
);
