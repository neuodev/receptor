import { DataTypes, ModelDefined, Optional } from "sequelize";
import { Notification } from "./Notification";
import sequelize from "../db";

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const User: ModelDefined<
  IUser,
  Optional<IUser, "id" | "isActive" | "createdAt" | "updatedAt">
> = sequelize.define("user", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// One (user) to Many(Notifications) releationship
User.hasMany(Notification, {
  foreignKey: "userId",
});
Notification.belongsTo(User);
