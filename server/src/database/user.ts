import { Op } from "sequelize";
import { IUser, User } from "../models/User";

export type NewUserParams = {};

class UserUOW {
  async newUser(data: {
    username: string;
    password: string;
    email: string;
    isActive?: boolean;
  }): Promise<number> {
    const user = await User.create(data);
    return user.getDataValue("id");
  }

  async getAll() {
    return await User.findAll({});
  }

  async getByIds(ids: Array<number>): Promise<Array<IUser>> {
    const match = ids.map((id) => ({ id }));
    const users = await User.findAll({
      where: {
        [Op.or]: match,
      },
      attributes: { exclude: ["password"] },
    });

    return users.map((user) => user.get());
  }

  async getById(id: number): Promise<IUser | null> {
    const user = await User.findOne({
      where: {
        id,
      },
    });

    return user ? user.get() : null;
  }

  async flush() {
    await User.truncate();
  }

  async getUser(username: string, password: string): Promise<IUser | null> {
    let user = await User.findOne({
      where: {
        username,
        password,
      },
      attributes: { exclude: ["password"] },
    });

    return user ? user.get() : null;
  }

  async updateUserStatus(id: number, isActive: boolean) {
    await User.update(
      {
        isActive,
      },
      {
        where: {
          id,
        },
      }
    );
  }
}

const userUOW = new UserUOW();
export default userUOW;
