import { Socket } from "socket.io";
import { ValidationError } from "sequelize";
import { ErrorEvents, Event } from "../events";

export function sendErrorMsg(
  error: unknown,
  socket: Socket,
  event: Event,
  defaultMsg: string = "Unexpected error happend"
) {
  let message = defaultMsg;
  if (error instanceof Error || error instanceof ValidationError)
    message = error.message;
  else if (typeof error === "string") message = error;

  socket.emit(event, { message });
}
