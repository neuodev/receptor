export function parseQuery<T>(result: any): T {
  return JSON.parse(JSON.stringify(result)) as unknown as T;
}
