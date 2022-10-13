import { DataTypes, ModelDefined, Optional } from "sequelize";
import sequelize from "../db";
import { User } from "../models/User";
import { Room } from "./Room";

export interface IParticipants {
  id: number;
  userId: number;
  roomId: number;
}

export const Participants: ModelDefined<
  IParticipants,
  Optional<IParticipants, "id">
> = sequelize.define("participants", {
  id: {
    type: DataTypes.NUMBER,
    allowNull: false,
    primaryKey: true,
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
