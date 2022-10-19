import axios from "axios";
import { COMMON_HEADERS, getEndpoint } from "../../constants/api";
import { UsersRelation } from "../../state/users/reducer";
import { useAuthHeaders } from "../../state/user/hooks";
import { IUser } from "../../state/user/reducer";
import { IFriend } from "../../state/friends/reducer";

export type RegisterReq = {
  username: string;
  email: string;
  password: string;
};

export type LoginReq = {
  email: string;
  password: string;
};

export const useUserApi = () => {
  const headers = useAuthHeaders();

  async function getUsers(
    q?: string,
    limit: number = 10,
    page: number = 1
  ): Promise<Array<IUser & { relation: UsersRelation }>> {
    const { data } = await axios.get(getEndpoint("getUsers"), {
      headers,
      params: {
        q,
        limit,
        page,
      },
    });
    return data.users;
  }

  async function getUserFriends(): Promise<IFriend[]> {
    const { data } = await axios.get<IFriend[]>(getEndpoint("getFriends"), {
      headers,
    });

    return data;
  }

  async function register(data: RegisterReq) {
    await axios.post(getEndpoint("register"), data, {
      headers: COMMON_HEADERS,
    });
  }

  async function login(
    body: LoginReq
  ): Promise<{ token: string; user: IUser }> {
    const { data } = await axios.post(getEndpoint("login"), body, {
      headers: COMMON_HEADERS,
    });

    return data;
  }

  return { getUsers, getUserFriends, register, login };
};
