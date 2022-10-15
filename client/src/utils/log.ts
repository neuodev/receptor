export const logGroup = (name: string, res: any) => {
  console.group(name);
  console.count(name);
  console.log(res);
  console.groupEnd();
};
