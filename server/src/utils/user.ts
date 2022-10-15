import { FriendshipStatus, UsersRelation } from "../models/Friend";

export const getUserPrivateRoom = (id: number) => `user_${id}`;
export const getRoomId = (id: number) => `room_${id}`;

export function getUserRelation(
  relation: { userId: number; friendId: number; status: FriendshipStatus },
  userId: number
): UsersRelation {
  switch (relation.status) {
    case FriendshipStatus.Friends:
      return UsersRelation.Friends;
    case FriendshipStatus.Pending:
      return userId === relation.userId
        ? UsersRelation.PendingResponse
        : userId === relation.friendId
        ? UsersRelation.PendingRequest
        : UsersRelation.NotFriends;
    default:
      return UsersRelation.NotFriends;
  }
}
