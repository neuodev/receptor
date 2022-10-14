import { Message, MessageType } from "../models/Message";
import BaseRepo from "./baseRepo";

export default class MessageRepo extends BaseRepo {
  async newMessage(msg: {
    type: MessageType;
    body: string;
    read: boolean;
    userId: number;
    roomId: number;
  }) {
    await Message.create(msg);
  }
}
