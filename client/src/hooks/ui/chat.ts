import { IFriend } from "../../state/friends/reducer";
import { IUser } from "../../state/user/reducer";
import { useAppSelector } from "../../store";

export interface IChat {
  id: number;
  isGroup: boolean;
  name: string;
  email: string | null;
  updatedAt: string;
  createdAt: string;
  participants: Array<IFriend | IUser>;
}

export const useChat = () => {
  const { currRoom, friends, groups, user } = useAppSelector((state) => ({
    currRoom: state.messages.currRoom,
    friends: state.friends.list,
    groups: state.groups.groups.list,
    user: state.user.info,
  }));

  function getChatList(): IChat[] {
    const chatsList: IChat[] = [];
    if (user != null) {
      friends.forEach((friend) => {
        chatsList.push({
          id: friend.roomId,
          email: friend.email,
          isGroup: false,
          createdAt: friend.createdAt,
          updatedAt: friend.updatedAt,
          name: friend.username,
          participants: [user, friend],
        });
      });

      groups.forEach((group) => {
        chatsList.push({
          id: group.id,
          isGroup: true,
          name: group.name,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
          email: null,
          participants: group.participants,
        });
      });
    }

    return chatsList;
  }

  const isCurrentRoom = (id: number) => id === currRoom;

  return {
    currRoom,
    getChatList,
    isCurrentRoom,
  };
};
