export function getAvatarLetters(name: string): string {
  if (name.length === 0) throw new Error("Invalid name");
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
