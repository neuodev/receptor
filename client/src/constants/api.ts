export const API = {
  login: "/api/v1/user/login",
  register: "/api/v1/user/register",
  getUsers: "/api/v1/user", // get all users
  getFriends: "/api/v1/user/friends",
  getRoomMessages: (id: string) => `/api/v1/room/${id}`,
  getGroups: "/api/v1/group",
  createGroup: "/api/v1/group",
  deleteGroup: (id: string) => `/api/v1/group/${id}`,
  leaveGroup: (id: string) => `/api/v1/group/${id}/leave`,
};

export const getEndpoint = (
  key: keyof typeof API,
  ...params: Array<string | number>
) => {
  let api = API[key];
  if (typeof api == "function") api = api.apply(null, params as any);
  return withServerPrefix(api);
};

export const COMMON_HEADERS = {
  "Content-Type": "application/json",
};

export const withServerPrefix = (api: string) => {
  let uri = process.env.REACT_APP_SERVER;
  if (!uri) throw new Error("Missing server uri");
  return `${uri}${api}`;
};
