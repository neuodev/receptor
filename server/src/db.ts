import { Sequelize, DataTypes } from "sequelize";

export const sequelize = new Sequelize(
  process.env.PSQL_URI || "postgres://postgres:changeme@localhost:5432/receptor"
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
User.hasMany(Notification);
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
  foreignKey: "userId",
});

User.hasOne(Friend, {
  foreignKey: "friendId",
});

// Check database connection
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });

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
