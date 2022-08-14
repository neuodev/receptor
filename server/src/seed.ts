import sequelize, { User } from "./db";
import fs from "fs/promises";
import "colors";
import { Room } from "./models/Room";
import { Message } from "./models/message";
import { Participants } from "./models/Participants";

export const seedDB = async () => {
  try {
    const data = (await fs.readFile("./src/data/users.json")).toString();
    const users: Array<{
      id: number;
      username: string;
      password: string;
    }> = JSON.parse(data);

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
    process.exit(0); // Server should restart
  } catch (error) {
    let msg;

    if (error instanceof Error) msg = error.message;
    else msg = error;

    console.log(`flushing database failed: ${msg}`.red.underline.bold);
    console.error(error);
  }
};
