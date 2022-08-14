import sequelize from "../db";

// Fields: id, roomId, userId
export const participants = sequelize.define("participants", {});
