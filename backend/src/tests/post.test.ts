import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Post, { IPost } from "../models/post_model";
import User, { IUser } from "../models/user_model";

let app: Express;
const user : IUser= {
  _id: null,
  username: "alonBee",
  password: "a1234567890",
  firstName: "alon",
  lastName: "test",
  phoneNumber: "050-0000000",
}

const post: IPost = {
  _id: null,
  description: "title1",
  breed: "test",
  breedId: 2,
  ownerId: null,
  likes: null,
  createdAt: null,
  updatedAt: null,
};
let accessToken = "";

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");

  await Post.deleteOne({ breed: post.breed});
  await User.deleteOne({ username: user.username });
  const response = await request(app).post("/auth/register").send(user);
  user._id = response.body._id;
  const response2 = await request(app).post("/auth/login").send(user);
  accessToken = response2.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});



describe("Post tests", () => {

  const addPost = async (post: IPost) => {
    const response = await request(app)
      .post("/post/create")
      .set("Authorization", "JWT " + accessToken)
      .send(post);
    expect(response.statusCode).toBe(201);
    const rs = response.body[0];
    expect(rs.ownerId).toBe(user._id);
    expect(rs.description).toBe(post.description);
    expect(rs.breed).toBe(post.breed);
    expect(rs.breedId).toBe(post.breedId);
  };

  test("Test Get All User Posts - Empty Response", async () => {
    const response = await request(app)
      .get("/post/allByUser/"+user._id)
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test("Test POST post", async () => {
    addPost(post);
  });

  test("Test Get All User's Posts", async () => {

    const response = await request(app)
      .get("/post/allByUser/"+user._id)
      .set("Authorization", "JWT " + accessToken);

    expect(response.statusCode).toBe(200);
    const rs = response.body;
    console.log(response);
    expect(rs.ownerId).toBe(user._id);
    expect(rs.description).toBe(post.description);
    expect(rs.breed).toBe(post.breed);
    expect(rs.breedId).toBe(post.breedId);
  });

  test("Test PUT Post", async () => {
    const updatedPost = { ...user, description: "title2" };
    const response = await request(app)
                            .put("/post/edit")
                            .set("Authorization", "JWT " + accessToken)
                            .send(updatedPost);
    expect(response.statusCode).toBe(200);
    expect(response.body.description).toBe(updatedPost.description);
  });

  test("Test DELETE post", async () => {
    post._id = (await Post.findOne({breed: "test" })).ownerId;
    const response = await request(app)
                            .delete("/post/delete/"+post._id)
                            .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
  });

});