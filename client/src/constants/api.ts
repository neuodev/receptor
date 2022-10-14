import { RoomId } from "../state/messages/reducer";

export const API = {
  login: "/api/v1/user/login",
  register: "/api/v1/user/register",
  getUsers: "/api/v1/user", // get all users
  getFriends: "/api/v1/user/friends",
  getRoomMessages: (id: RoomId) => `/api/v1/room/${id}`,
};

export const getEndpoint = (key: keyof typeof API) => {
  let uri = process.env.REACT_APP_SERVER;
  if (!uri) throw new Error("Missing server uri");
  return `${uri}${API[key]}`;
};

export const COMMON_HEADERS = {
  "Content-Type": "application/json",
};
