import { Notification, NotificationType } from "../db";

class NotificationRepo {
  async pushNotification(n: {
    content: string;
    type: NotificationType;
    userId: number;
  }) {
    await Notification.create({
      content: n.content,
      type: n.type,
      UserId: n.userId,
      isSeen: false,
    });
  }
}

export const notificationRepo = new NotificationRepo();
