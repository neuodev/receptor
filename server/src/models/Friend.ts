import { DataTypes, ModelDefined, Optional } from "sequelize";
import sequelize from "../db";
import { User } from "./User";

export enum FriendshipStatus {
  PENDING = "pending",
  FRIENDS = "friends",
  BLOCKED = "blocked",
}

export interface IFriend {
  id: number;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
  userId: number;
  friendId: number;
}

export const Friend: ModelDefined<
  IFriend,
  Optional<IFriend, "id" | "createdAt" | "updatedAt">
> = sequelize.define("friend", {
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
