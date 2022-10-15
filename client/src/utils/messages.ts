import { IMessage, MessageType, RoomId } from "../state/messages/reducer";

export type GroupedMessage = {
  roomId: RoomId;
  content: Array<{ type: MessageType; body: string }>;
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
    content: [{ type: msg.type, body: msg.body }],
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
      prevMsg.content.push({ type: msg.type, body: msg.body });
      prevMsg.createdAt = msg.createdAt;
      prevMsg.updatedAt = msg.updatedAt;
    }
  });

  return groupedMessages;
}
