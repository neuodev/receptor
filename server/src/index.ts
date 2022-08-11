import express from "express";
import http from "http";
import { Server } from "socket.io";
import "colors";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connect", (socket) => {
  console.log("New connection");
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.green.underline.bold)
);
