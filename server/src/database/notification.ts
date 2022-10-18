import { INotification, Notification } from "../models/Notification";

class NotificationUOW {
  async getUserNotifications(userId: number): Promise<INotification[]> {
    let all = await Notification.findAll({
      where: {
        userId,
      },
    });
    return all.map((n) => n.get());
  }
}

const notificationUOW = new NotificationUOW();
export default notificationUOW;
