import { DataTypes, ModelDefined, Optional } from "sequelize";
import sequelize from "../db";
import { Room } from "./Room";
import { User } from "./User";

export enum MessageType {
  Text = "text",
  Audio = "audio",
  Video = "video",
  Image = "image",
}

export interface IMessage {
  id: number;
  type: MessageType;
  body: string;
  read: boolean;
  userId: number;
  roomId: number;
}

export const Message: ModelDefined<
  IMessage,
  Optional<IMessage, "id" | "read">
> = sequelize.define("message", {
  type: {
    type: DataTypes.ENUM(
      MessageType.Text,
      MessageType.Audio,
      MessageType.Video,
      MessageType.Image
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

// Sender associations
const options = {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
};

User.hasMany(Message, options);
Message.belongsTo(User, options);

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
