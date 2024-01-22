const BASE_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000/";

const AUTH_CONTROLLER = "auth/";
const POST_CONTROLLER = "post/";
const FILES = "uploads/";

export const globals = {
  auth: {
    auth: BASE_URL + AUTH_CONTROLLER,
    register: BASE_URL + AUTH_CONTROLLER + "register",
    login: BASE_URL + AUTH_CONTROLLER + "login",
    refreshToken: BASE_URL + AUTH_CONTROLLER + "refresh",
    logout: BASE_URL + AUTH_CONTROLLER + "logout",
  },
  posts: {
    posts: BASE_URL + POST_CONTROLLER,
    create: BASE_URL + POST_CONTROLLER + "create/",
  },
  files: BASE_URL + FILES,
};
