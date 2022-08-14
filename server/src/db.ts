import { Sequelize, DataTypes } from "sequelize";
import { flush, seedDB } from "./seed";

export const DB_NAME = process.env.DB_NAME || "receptor";
const sequelize = new Sequelize(
  process.env.PSQL_URI ||
    `postgres://postgres:changeme@localhost:5432/${DB_NAME}`
);

export const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

export enum NotificationType {
  FRIENDSHIP_REQUEST = "friendshipRequest",
}

export const Notification = sequelize.define("Notification", {
  content: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  isSeen: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  type: {
    type: DataTypes.ENUM(NotificationType.FRIENDSHIP_REQUEST),
    allowNull: false,
  },
});
// One (user) to Many(Notifications) releationship
User.hasMany(Notification, {
  foreignKey: "userId",
});
Notification.belongsTo(User);

export enum FriendshipStatus {
  PENDING = "pending",
  FRIENDS = "friends",
  BLOCKED = "blocked",
}
export const Friend = sequelize.define("Friend", {
  status: {
    type: DataTypes.ENUM(
      FriendshipStatus.PENDING,
      FriendshipStatus.BLOCKED,
      FriendshipStatus.FRIENDS
    ),
    allowNull: false,
  },
});

User.hasMany(Friend, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

Friend.belongsTo(User, {
  foreignKey: {
    name: "friendId",
    allowNull: false,
  },
});

// Check database connection
(async () => {
  try {
    await sequelize.authenticate();

    if (process.argv[2] === "seed") {
      seedDB();
    } else if (process.argv[2] === "flush") {
      flush();
    } else {
      await sequelize.sync({ force: false });
    }

    console.log("Connected to PostgreSQL".green.underline.bold);
  } catch (error) {
    if (error instanceof Error)
      console.log(
        `Unable to connection to the database: ${error.message}`.red.underline
          .bold
      );

    process.exit(1);
  }
})();

export default sequelize;
