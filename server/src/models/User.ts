import { DataTypes } from "sequelize";
import { Notification } from "./Notification";
import sequelize from "../db";

export const User = sequelize.define("User", {
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
