import sequelize from "../db";
import { DataTypes } from "sequelize";

export enum NotificationType {
  FriendshipRequest = "friendshipRequest",
}

export const Notification = sequelize.define("Notification", {
  content: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  isSeen: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  type: {
    type: DataTypes.ENUM(NotificationType.FriendshipRequest),
    allowNull: false,
  },
});
