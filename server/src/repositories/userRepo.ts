import { User } from "../db";

export type RegisterUserPramas = {
  username: string;
  password: string;
  isActive?: boolean;
};

export default class UserRepo {
  async registerUser(data: RegisterUserPramas): Promise<string> {
    const user = await User.create(data);
    return user.getDataValue("id") as string;
  }
}

export const userRepo = new UserRepo();
