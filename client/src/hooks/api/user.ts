import axios from "axios";
import { getEndpoint } from "../../constants/api";
import { UsersRelation } from "../../state/users/reducer";
import { useAuthHeaders } from "../../state/user/hooks";
import { IUser } from "../../state/user/reducer";

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
  return { getUsers };
};
