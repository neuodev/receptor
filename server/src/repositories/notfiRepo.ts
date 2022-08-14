import { Op } from "sequelize";
import { Socket } from "socket.io";
import AppUOW from ".";
import { Notification, NotificationType, User } from "../db";
import { Event } from "../events";
import BaseRepo from "./baseRepo";
import { UserEntry } from "./userRepo";

export type NotificationEntry = {
  content: string;
  type: NotificationType;
  UserId: number | UserEntry;
  isSeen: boolean;
};

export default class NotificationRepo extends BaseRepo {
  constructor(app: AppUOW) {
    super(app);
  }
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

  async handleNotificationsEvent() {
    const { socket } = this.app;
    await this.errorHandler(
      async () => {
        const userId = this.app.decodeAuthToken();
        const user = await this.app.userRepo.getUserById(userId);
        if (!user) throw new Error("User not foudn");
        let notifications = this.getNotifications(user.id);

        socket.emit(Event.NOTIFICATION, notifications);
      },
      socket,
      Event.NOTIFICATION
    );
  }
}

// export const notificationRepo = new NotificationRepo();
