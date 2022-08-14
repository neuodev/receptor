import { Friend, Notification, sequelize, User } from "./db";
import fs from "fs/promises";
import "colors";

export const seedDB = async () => {
  try {
    const data = (await fs.readFile("./src/data/users.json")).toString();
    const users: Array<{
      id: number;
      username: string;
      password: string;
    }> = JSON.parse(data);

    // await Promise.all(users.map((user) => userRepo.registerUser(user)));

    console.log("Database seeded".bgRed.underline.bold);
  } catch (error) {
    if (error instanceof Error)
      console.log(`Seed database failed: ${error.message}`.red.underline.bold);
  }
};

export const flush = async () => {
  console.log("Delete all database tables".red.underline.bold);
  try {
    sequelize.sync({ force: true }); // Reset all tables

    console.log(`Reset database`.cyan.underline.bold);
  } catch (error) {
    let msg;

    if (error instanceof Error) msg = error.message;
    else msg = error;

    console.log(`flushing database failed: ${msg}`.red.underline.bold);
    console.error(error);
  }
};

if (process.argv[2] === "seed") {
  seedDB();
} else if (process.argv[2] === "flush") {
  flush();
}
