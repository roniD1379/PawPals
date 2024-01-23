const BASE_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000/";

const AUTH_CONTROLLER = "auth/";
const POST_CONTROLLER = "post/";
const USER_CONTROLLER = "user/";
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
    feedPosts: BASE_URL + POST_CONTROLLER + "feed",
    userPosts: BASE_URL + POST_CONTROLLER + "allByUser",
    create: BASE_URL + POST_CONTROLLER + "create",
    like: BASE_URL + POST_CONTROLLER + "like",
    dislike: BASE_URL + POST_CONTROLLER + "dislike",
    createComment: BASE_URL + POST_CONTROLLER + "comment",
    comments: BASE_URL + POST_CONTROLLER + "comments",
    edit: BASE_URL + POST_CONTROLLER + "edit",
    delete: BASE_URL + POST_CONTROLLER + "delete",
  },
  users: {
    userDetails: BASE_URL + USER_CONTROLLER + "details",
  },
  files: BASE_URL + FILES,
};
