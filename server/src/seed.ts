import sequelize from "./db";
import users from "./data/users.json";
import { User } from "./models/User";
import { Message } from "./models/Message";
import { Notification } from "./models/Notification";
import { Room } from "./models/Room";
import { Participants } from "./models/Participants";
import { Friend } from "./models/Friend";
import "colors";

export const seedDB = async () => {
  try {
    await sequelize.sync({ force: false });
    await User.bulkCreate(users);
    console.log("Database seeded".bgGreen.underline.bold);
  } catch (error) {
    if (error instanceof Error)
      console.log(`Seed database failed: ${error.message}`.red.underline.bold);

    console.error(error);
  }
};

export const flush = async () => {
  console.log("Delete all database tables".red.underline.bold);
  try {
    await User.drop({ cascade: true });
    await Room.drop({ cascade: true });
    await Notification.drop({ cascade: true });
    await Participants.drop({ cascade: true });
    await Friend.drop({ cascade: true });
    await Message.drop({ cascade: true });
    process.exit(0);
  } catch (error) {
    let msg;

    if (error instanceof Error) msg = error.message;
    else msg = error;

    console.log(`flushing database failed: ${msg}`.red.underline.bold);
    console.error(error);
  }
};

let arg = process.argv[2];
if (arg === "seed") {
  seedDB();
} else if (arg === "flush") {
  flush();
}
