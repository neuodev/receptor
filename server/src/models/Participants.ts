import sequelize, { User } from "../db";
import { Room } from "./Room";

// Fields: id, roomId, userId
export const Participants = sequelize.define("participants", {});

User.hasMany(Participants, {
  foreignKey: "userId",
});

Participants.belongsTo(User);

Room.hasMany(Participants, {
  foreignKey: "roomId",
});

Participants.belongsTo(Room);
