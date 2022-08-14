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

const foreignKeys = ["userId", "friendId"];

foreignKeys.forEach((name) => {
  const options = {
    foreignKey: {
      name,
      allowNull: false,
    },
  };
  User.hasMany(Friend, options);
  Friend.belongsTo(User, options);
});
