import { IMessage, Message, MessageType } from "../models/Message";

class MessageUOW {
  async newMessage(msg: {
    type: MessageType;
    body: string;
    read: boolean;
    userId: number;
    roomId: number;
  }): Promise<IMessage> {
    return (await Message.create(msg)).get();
  }

  async deleteRoomMessages(roomId: number) {
    await Message.destroy({
      where: {
        roomId,
      },
    });
  }
}

const messageUOW = new MessageUOW();
export default messageUOW;
