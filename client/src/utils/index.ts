export function clone<T>(data: T) {
  return JSON.parse(JSON.stringify(data)) as T;
}
