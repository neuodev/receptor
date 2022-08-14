import { DataTypes } from "sequelize";
import sequelize from "../db";

export enum MessageType {
  TEXT = "text",
  AUDIO = "audio",
  VIDEO = "video",
  IMAGE = "image",
}

export const Message = sequelize.define("message", {
  type: {
    type: DataTypes.ENUM(
      MessageType.TEXT,
      MessageType.AUDIO,
      MessageType.VIDEO,
      MessageType.IMAGE
    ),
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
