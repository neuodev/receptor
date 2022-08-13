import { Op } from "sequelize";
import { Socket } from "socket.io";
import { Notification, NotificationType, User } from "../db";
import { Event } from "../events";
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

  async handleNotificationsEvent(socket: Socket, token: string | null) {
    const result = await this.errorHandler(async () => {
      const userId = this.decodeAuthToken(token);
      const user = await userRepo.getUserById(userId);
      if (!user) throw new Error("User not foudn");
      return this.getNotifications(user.id);
    });

    socket.emit(Event.NOTIFICATION, result);
  }
}

export const notificationRepo = new NotificationRepo();
