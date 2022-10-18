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

/**
 * Generic search function that search using object keys
 */
export function searchBy<T>(
  keyword: string,
  list: Array<T>,
  keys: Array<keyof T>
) {
  let regexp = new RegExp(keyword, "gi");
  return list.filter((user) =>
    keys.some((key) => regexp.test(String(user[key])))
  );
}
