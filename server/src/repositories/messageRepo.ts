import { Message, MessageType } from "../models/Message";
import BaseRepo from "./baseRepo";

export type MessageEntry = {
  type: MessageType;
  body: string;
  read: boolean;
  sender: number;
  receiver: number;
  roomId: number;
};

export default class MessageRepo extends BaseRepo {
  async newMessage(msg: MessageEntry) {
    await Message.create(msg);
  }
}
