import { DataTypes } from "sequelize";
import sequelize, { User } from "../db";

export enum FriendshipStatus {
  PENDING = "pending",
  FRIENDS = "friends",
  BLOCKED = "blocked",
}
export const Friend = sequelize.define("Friend", {
  status: {
    type: DataTypes.ENUM(
      FriendshipStatus.PENDING,
      FriendshipStatus.BLOCKED,
      FriendshipStatus.FRIENDS
    ),
    allowNull: false,
  },
});

User.hasMany(Friend, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

Friend.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

User.hasMany(Friend, {
  foreignKey: {
    name: "friendId",
    allowNull: false,
  },
});

Friend.belongsTo(User, {
  foreignKey: {
    name: "friendId",
    allowNull: false,
  },
});
