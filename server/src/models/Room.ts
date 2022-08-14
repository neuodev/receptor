import { DataTypes } from "sequelize";
import sequelize from "../db";

export enum RoomType {
  DM = "DM", // Direct Message
  GROUP = "GROUP",
}

export const Room = sequelize.define("room", {
  name: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM(RoomType.DM, RoomType.GROUP),
  },
});
