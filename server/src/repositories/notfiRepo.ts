import { Op } from "sequelize";
import { Notification, NotificationType } from "../db";

class NotificationRepo {
  async pushNotification(n: {
    content: {
      userId: number;
    };
    type: NotificationType;
    userId: number;
  }) {
    // Check if notification exist
    await Notification.create({
      content: n.content,
      type: n.type,
      UserId: n.userId,
      isSeen: false,
    });
  }

  async isFriendshipRequestAlreadySent(sender: number, receiver: number) {
    let notif = await Notification.findOne({
      where: {
        "content.userId": {
          [Op.eq]: sender,
        },
        UserId: receiver,
      },
    });

    return notif?.get();
  }
}

export const notificationRepo = new NotificationRepo();
