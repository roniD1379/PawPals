import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Post, { IPost } from "../models/post_model";
import User, { IUser } from "../models/user_model";
import * as path from "path";

let app: Express;
const user: IUser = {
  username: "alonBee",
  password: "a1234567890",
  firstName: "alon",
  lastName: "test",
  phoneNumber: "050-0000000",
};

const post: IPost = {
  description: "title1",
  breed: "test",
  breedId: 2,
  ownerId: null,
  image: null,
};
let accessToken = "";

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");

  await User.deleteOne({ username: user.username });
  await Post.deleteOne({ breed: post.breed });
  await request(app).post("/auth/register").send(user);
  const response = await request(app).post("/auth/login").send(user);
  accessToken = response.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Post tests", () => {
  const addPost = async (post: IPost) => {
    const imagePath = path.resolve(__dirname, ".\\images\\dog_post_img.jpg");
    const response = await request(app)
      .post("/post/create")
      .field("description", post.description)
      .field("breedId", post.breedId.toString())
      .field("breed", post.breed)
      .set("Authorization", "Bearer " + accessToken)
      .attach("image", imagePath);

    expect(response.status).toBe(201);
  };

  test("Test POST Post", async () => {
    await addPost(post);
  });
});
