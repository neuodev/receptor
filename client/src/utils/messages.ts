import { IMessage, MessageType, RoomId } from "../state/messages/reducer";

export type GroupedMessage = {
  roomId: RoomId;
  content: Array<{
    id: number;
    type: MessageType;
    body: string;
    createdAt: string;
  }>;
  user: {
    id: number;
    username: string;
    email: string;
    isActive: boolean;
  };
  createdAt: string;
  updatedAt: string;
};

export function groupUserMessages(messages: IMessage[]): GroupedMessage[] {
  const asGrouped: (msg: IMessage) => GroupedMessage = (msg) => ({
    roomId: msg.roomId,
    user: msg.user,
    content: [
      { id: msg.id, type: msg.type, body: msg.body, createdAt: msg.createdAt },
    ],
    createdAt: msg.createdAt,
    updatedAt: msg.updatedAt,
  });

  let groupedMessages: GroupedMessage[] = [];
  let prevMsg: GroupedMessage | null = null;
  messages.forEach((msg) => {
    if (prevMsg == null) {
      prevMsg = asGrouped(msg);
    } else if (prevMsg.user.id !== msg.user.id) {
      groupedMessages.push(prevMsg);
      prevMsg = asGrouped(msg);
    } else {
      prevMsg.content.push({
        id: msg.id,
        type: msg.type,
        body: msg.body,
        createdAt: msg.createdAt,
      });
      prevMsg.createdAt = msg.createdAt;
      prevMsg.updatedAt = msg.updatedAt;
    }
  });

  if (prevMsg != null) groupedMessages.push(prevMsg);

  return groupedMessages;
}
