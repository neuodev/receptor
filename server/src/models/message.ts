import { DataTypes } from "sequelize";
import sequelize from "../db";
import { Room } from "./Room";
import { User } from "./User";

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
    defaultValue: null,
  },
  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// Sender and receiver associations
const usersKeys = ["sender", "receiver"];

usersKeys.forEach((name) => {
  const options = {
    foreignKey: {
      name,
      allowNull: false,
    },
  };
  User.hasMany(Message, options);
  Message.belongsTo(User, options);
});

// Room Associations
Room.hasMany(Message, {
  foreignKey: {
    name: "roomId",
  },
});

Message.belongsTo(Room, {
  foreignKey: {
    name: "roomId",
  },
});
