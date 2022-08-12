import { User } from "../db";

export type UserEntry = {
  username: string;
  password: string;
  isActive: boolean;
  id: number;
};

export default class UserRepo {
  async registerUser(data: {
    username: string;
    password: string;
    isActive?: boolean;
  }): Promise<string> {
    const user = await User.create(data);
    return user.getDataValue("id") as string;
  }

  async getUsers() {
    return await User.findAll({});
  }

  async flush() {
    await User.truncate();
  }

  async getUser(username: string, password: string): Promise<UserEntry | null> {
    let user = await User.findOne({
      where: {
        username,
        password,
      },
      attributes: { exclude: ["password"] },
    });

    return user === null
      ? null
      : (JSON.parse(JSON.stringify(user)) as UserEntry);
  }
}

export const userRepo = new UserRepo();
