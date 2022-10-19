import axios from "axios";
import { getEndpoint } from "../../constants/api";
import { UserId } from "../../state/friend/reducer";
import { GropuId, IGroup } from "../../state/groups/reducer";
import { useAuthHeaders } from "../../state/user/hooks";

export const useGroupApi = () => {
  const headers = useAuthHeaders();
  async function getGroups(): Promise<IGroup[]> {
    const { data } = await axios.get<IGroup[]>(getEndpoint("getGroups"), {
      headers,
    });

    return data;
  }

  async function createGroup(groupName: string, userIds: UserId[]) {
    await axios.post(
      getEndpoint("createGroup"),
      {
        groupName,
        userIds,
      },
      {
        headers,
      }
    );
  }

  async function deleteGroup(id: GropuId) {
    await axios.post(getEndpoint("deleteGroup", id), {
      headers,
    });
  }

  async function leaveGroup(id: GropuId) {
    await axios.post(getEndpoint("leaveGroup", id), {
      headers,
    });
  }

  return { getGroups, createGroup, deleteGroup, leaveGroup };
};
