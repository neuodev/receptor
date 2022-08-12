import { sequelize, User } from "./db";
import { userRepo } from "./repositories/userRepo";
import fs from "fs/promises";
import "colors";

export const seedDB = async () => {
  try {
    await flush();
    const data = (await fs.readFile("./data/users.json")).toString();
    const users: Array<{
      id: number;
      username: string;
      password: string;
    }> = JSON.parse(data);

    await Promise.all(users.map((user) => userRepo.registerUser(user)));

    console.log("Database seeded".bgRed.underline.bold);
  } catch (error) {
    if (error instanceof Error)
      console.log(`Seed database failed: ${error.message}`.red.underline.bold);
  }
};

export const flush = async () => {
  console.log("Delete all database tables".red.underline.bold);
  try {
    await userRepo.flush();
    console.log(`Reset database`.cyan.underline.bold);
  } catch (error) {
    let msg;

    if (error instanceof Error) msg = error.message;
    else msg = error;

    console.log(`Seed database failed: ${msg}`.red.underline.bold);
  }
};

if (process.argv[2] === "seed") {
  seedDB();
} else if (process.argv[2] === "flush") {
  flush();
}
