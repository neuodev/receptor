import { DataTypes, ModelDefined, Optional } from "sequelize";
import sequelize from "../db";
import { User } from "../models/User";
import { Room } from "./Room";

export enum Role {
  // Control any thing
  Owner = "owner",
  // Add/remove/block members
  Admin = "admin",
  // Members can send and receive messages
  Member = "member",
}

export interface IParticipants {
  id: number;
  userId: number;
  roomId: number;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export const Participants: ModelDefined<
  IParticipants,
  Optional<IParticipants, "id" | "createdAt" | "updatedAt">
> = sequelize.define("participants", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  role: {
    type: DataTypes.ENUM(Role.Admin, Role.Owner, Role.Member),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});

User.hasMany(Participants, {
  foreignKey: "userId",
});

Participants.belongsTo(User, {
  foreignKey: "userId",
});

Room.hasMany(Participants, {
  foreignKey: "roomId",
});

Participants.belongsTo(Room, {
  foreignKey: "roomId",
});
