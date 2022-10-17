import { IFriend } from "../state/friends/reducer";

export function groupFriendsByFirstLetter(friends: IFriend[]) {
  let result: { [key: string]: IFriend[] } = {};
  friends
    .sort((a, b) => a.username.localeCompare(b.username))
    .forEach((f) => {
      let firstLetter = f.username[0].toUpperCase();
      if (!result[firstLetter]) result[firstLetter] = [f];
      else result[firstLetter].push(f);
    });

  return result;
}
