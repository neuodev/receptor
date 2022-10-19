import { useGroupApi } from "../../hooks/api/group";
import { useAppDispatch } from "../../store";
import { getErrMsg } from "../../utils/error";
import { UserId } from "../friend/reducer";
import {
  creageGroupRest,
  createGroupsErr,
  createGroupsReq,
  createGroupsRes,
  getGroupsErr,
  getGroupsReq,
  getGroupsRes,
  groupActionErr,
  groupActionReq,
  groupActionRes,
} from "./actions";
import { GropuId, GroupAction } from "./reducer";

export const useGroups = () => {
  const groupApi = useGroupApi();
  const dispatch = useAppDispatch();

  /**
   * Update groups list. Should be run the background without loading state
   */
  async function refreshGroupsList() {
    try {
      const groups = await groupApi.getGroups();
      dispatch(getGroupsRes(groups));
    } catch (error) {
      dispatch(getGroupsErr(getErrMsg(error)));
    }
  }

  async function getGroups() {
    dispatch(getGroupsReq());
    await refreshGroupsList();
  }

  async function createGroup(groupName: string, userIds: UserId[]) {
    try {
      dispatch(createGroupsReq());
      await groupApi.createGroup(groupName, userIds);
      dispatch(createGroupsRes());
      await refreshGroupsList();
    } catch (error) {
      dispatch(createGroupsErr(getErrMsg(error)));
    }
  }

  function resetCreateGroupState() {
    dispatch(creageGroupRest());
  }

  async function deleteGroup(groupId: GropuId) {
    const action = GroupAction.Delete;
    try {
      dispatch(groupActionReq({ action, groupId }));
      await groupApi.deleteGroup(groupId);
      dispatch(groupActionRes({ action, groupId }));
      await refreshGroupsList();
    } catch (error) {
      dispatch(groupActionErr({ action, groupId, error: getErrMsg(error) }));
    }
  }

  async function leaveGroup(groupId: GropuId) {
    const action = GroupAction.Leave;
    try {
      dispatch(groupActionReq({ action, groupId }));
      await groupApi.leaveGroup(groupId);
      dispatch(groupActionRes({ action, groupId }));
      await refreshGroupsList();
    } catch (error) {
      dispatch(groupActionErr({ action, groupId, error: getErrMsg(error) }));
    }
  }

  return {
    getGroups,
    createGroup,
    deleteGroup,
    leaveGroup,
    resetCreateGroupState,
  };
};
