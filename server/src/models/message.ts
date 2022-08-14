import { DataTypes } from "sequelize";
import sequelize, { User } from "../db";
import { Room } from "./Room";

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

// Sender Associations
User.hasMany(Message, {
  foreignKey: {
    name: "sender",
  },
});

Message.belongsTo(User, {
  foreignKey: {
    name: "sender",
  },
});

// Receiver Associations
User.hasMany(Message, {
  foreignKey: {
    name: "receiver",
  },
});

Message.belongsTo(User, {
  foreignKey: {
    name: "receiver",
  },
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
