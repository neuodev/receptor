export const API = {
  login: "/api/v1/user/login",
  register: "/api/v1/user/register",
  users: "/api/v1/user", // get all users
};

export const getEndpoint = (key: keyof typeof API) => {
  let uri = process.env.REACT_APP_SERVER;
  if (!uri) throw new Error("Missing server uri");
  return `${uri}${API[key]}`;
};

export const COMMON_HEADERS = {
  "Content-Type": "application/json",
};
