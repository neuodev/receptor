import sequelize from "./db";
import users from "./data/users.json";
import { User } from "./models/User";
import "colors";

export const seedDB = async () => {
  try {
    await User.bulkCreate(users);
    console.log("Database seeded".bgRed.underline.bold);
  } catch (error) {
    if (error instanceof Error)
      console.log(`Seed database failed: ${error.message}`.red.underline.bold);
  }
};

export const flush = async () => {
  console.log("Delete all database tables".red.underline.bold);
  try {
    await sequelize.sync({ force: true });

    console.log(`Reset database`.cyan.underline.bold);
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
