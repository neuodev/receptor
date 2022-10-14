import sequelize from "../db";
import { DataTypes, ModelDefined, Optional } from "sequelize";
import { IUser } from "./User";

export enum NotificationType {
  FriendshipRequest = "friendshipRequest",
}

export interface INotification {
  id: number;
  userId: number;
  content: string;
  isSeen: boolean;
  type: NotificationType;
  createdAt: string;
  updatedAt: string;
}

export const Notification: ModelDefined<
  INotification,
  Optional<INotification, "id" | "updatedAt" | "createdAt">
> = sequelize.define("notification", {
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
