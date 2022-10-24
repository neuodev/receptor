import { useEffect } from "react";
import { useGroupApi } from "../../hooks/api/group";
import { useAppDispatch, useAppSelector } from "../../store";
import { getErrMsg } from "../../utils/error";
import { useAppSocket } from "../../wss/appSocket";
import { UserId } from "../friend/reducer";
import { useRoom } from "../messages/hooks";
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
  const { setCurrentRoom } = useRoom();
  const { joinRooms } = useAppSocket();
  const user = useAppSelector((state) => state.user.info);
  const friends = useAppSelector((state) => state.friends);

  /**
   * Update groups list. Should be run the background without loading state
   */
  async function refreshGroupsList() {
    try {
      const groups = await groupApi.getGroups();
      joinRooms(groups.map((g) => g.id));
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
      await refreshGroupsList();
      dispatch(createGroupsRes());
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
      await refreshGroupsList();
      dispatch(groupActionRes({ action, groupId }));
      setCurrentRoom(null);
    } catch (error) {
      dispatch(groupActionErr({ action, groupId, error: getErrMsg(error) }));
    }
  }

  async function leaveGroup(groupId: GropuId) {
    const action = GroupAction.Leave;
    try {
      dispatch(groupActionReq({ action, groupId }));
      await groupApi.leaveGroup(groupId);
      await refreshGroupsList();
      dispatch(groupActionRes({ action, groupId }));
      setCurrentRoom(null);
    } catch (error) {
      dispatch(groupActionErr({ action, groupId, error: getErrMsg(error) }));
    }
  }

  useEffect(() => {
    refreshGroupsList();
  }, [user, friends]);

  useEffect(() => {
    getGroups();
  }, []);

  return {
    getGroups,
    createGroup,
    deleteGroup,
    leaveGroup,
    resetCreateGroupState,
  };
};
