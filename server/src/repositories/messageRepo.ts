import { IMessage, Message, MessageType } from "../models/Message";
import BaseRepo from "./baseRepo";

export default class MessageRepo extends BaseRepo {
  async newMessage(msg: {
    type: MessageType;
    body: string;
    read: boolean;
    userId: number;
    roomId: number;
  }): Promise<IMessage> {
    return (await Message.create(msg)).get();
  }

  async deleteRoommMessages(roomId: number) {
    await Message.destroy({
      where: {
        roomId,
      },
    });
  }
}
