import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { Socket } from "socket.io";
import { Event } from "../events";

export default class BaseRepo {
  decodeAuthToken(token: string | null): number {
    let secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is missing");
    if (!token) throw new Error("Missing auth token");
    let result = jwt.verify(token, secret);

    return (result as { id: number }).id as number;
  }

  async errorHandler<T>(func: Function, socket: Socket, event: Event) {
    try {
      return await func();
    } catch (error) {
      let msg = "Unexpected error";
      if (error instanceof JsonWebTokenError) {
        msg = "Invalid auth token";
      } else if (error instanceof Error) {
        msg = error.message;
      } else if (typeof error === "string") {
        msg = error;
      }

      socket.emit(event, {
        error: msg,
      });
    }
  }
}
