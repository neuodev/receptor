import { Op } from "sequelize";
import { Socket } from "socket.io";
import { Notification, NotificationType } from "../db";
import BaseRepo from "./baseRepo";
import { UserEntry, userRepo } from "./userRepo";

export type NotificationEntry = {
  content: string;
  type: NotificationType;
  UserId: number | UserEntry;
  isSeen: boolean;
};

class NotificationRepo extends BaseRepo {
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

  async getNotifications(userId: number): Promise<NotificationEntry[]> {
    let all = await Notification.findAll({
      where: {
        UserId: userId,
      },
    });

    return all.map((n) => n.get());
  }

  async handleNotificationsEvent(
    socket: Socket,
    data: { token: string; firendId: number }
  ) {
    try {
      const userId = this.decodeAuthToken(data.token);
      const users = await userRepo.getUsersByIds([userId, data.firendId]);
      const user = users.find((u) => u.id == userId);
      const firend = users.find((u) => u.id == data.firendId);

      if (!user) throw new Error("User not foudn");
      if (!firend) throw new Error("Friend not found");
    } catch (error) {}
  }
}

export const notificationRepo = new NotificationRepo();
