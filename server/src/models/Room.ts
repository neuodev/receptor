import { DataTypes, ModelDefined, Optional } from "sequelize";
import sequelize from "../db";

export enum RoomType {
  DM = "DM", // Direct Message
  Group = "group",
}

export interface IRoom {
  id: number;
  name: string | null;
  type: RoomType;
  createdAt: string;
  updatedAt: string;
}

export const Room: ModelDefined<
  IRoom,
  Optional<IRoom, "id" | "createdAt" | "updatedAt" | "name">
> = sequelize.define("room", {
  name: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM(RoomType.DM, RoomType.Group),
  },
});
