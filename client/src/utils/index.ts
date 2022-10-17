import produce from "immer";

export function clone<T>(data: T) {
  return produce(data, () => {});
}
