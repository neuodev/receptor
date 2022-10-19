import { IFriend } from "../../state/friends/reducer";
import { IUser } from "../../state/user/reducer";
import { useAppSelector } from "../../store";
import { clone } from "../../utils";

export interface IChat {
  id: number;
  isGroup: boolean;
  name: string;
  email: string | null;
  updatedAt: string;
  createdAt: string;
  participants: Array<IFriend | IUser>;
  isActive: boolean;
}

export const useChat = () => {
  const { currRoom, friends, groups, user } = useAppSelector((state) => ({
    currRoom: state.messages.currRoom,
    friends: state.friends,
    groups: state.groups.groups,
    user: state.user.info,
  }));

  function getChatList(): IChat[] {
    const chatsList: IChat[] = [];
    if (user != null) {
      groups.list.forEach((group) => {
        chatsList.push({
          id: group.id,
          isGroup: true,
          isActive: false,
          name: group.name,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
          email: null,
          participants: group.participants,
        });
      });

      friends.list.forEach((friend) => {
        chatsList.push({
          id: friend.roomId,
          email: friend.email,
          isGroup: false,
          isActive: friend.isActive,
          createdAt: friend.createdAt,
          updatedAt: friend.updatedAt,
          name: friend.username,
          participants: [user, friend],
        });
      });
    }

    return chatsList;
  }

  const isCurrentRoom = (id: number) => id === currRoom;
  const chatsList = getChatList();

  return {
    currRoom,
    chatsList,
    isCurrentRoom,
    loading: groups.loading || friends.loading,
    error: groups.error || friends.error,
  };
};
