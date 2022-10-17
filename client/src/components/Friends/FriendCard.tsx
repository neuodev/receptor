import React from "react";
import { IFriend } from "../../state/friends/reducer";

const FriendCard: React.FC<{ friend: IFriend }> = ({ friend }) => {
  return <div>{friend.username}</div>;
};

export default FriendCard;
