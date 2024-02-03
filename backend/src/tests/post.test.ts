import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Post, { IPost } from "../models/post_model";
import User, { IUser } from "../models/user_model";
import * as path from "path";
import { IComment } from "../models/comment_model";

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

let comment: IComment = {
  postId: null,
  text: "test",
  ownerId: null,
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

    return response;
  };

  test("Test POST Post", async () => {
    const response = await addPost(post);
    expect(response.status).toBe(201);
  });

  test("Test POST Post - required field is missing  ", async () => {
    const missedFieldPost: IPost = JSON.parse(JSON.stringify(post));
    missedFieldPost['breed'] = "";
    const response = await addPost(missedFieldPost);
    expect(response.status).toBe(400);
  });

   test("Test GET Post - feed", async () => {
    const response = await request(app)
                            .get("/post/feed/1")
                            .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    const postObj = response.body[0];
    expect(postObj.breed).toBe(post.breed);
    post._id = postObj._id;
  });

  test("Test GET Post - all by user", async () => {
    const response = await request(app)
                            .get("/post/allByUser/1")
                            .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    const postObj = response.body[0];
    expect(postObj.breed).toBe(post.breed);
    expect(postObj.ownerUsername).toBe(user.username);
  });

  test("Test Put Post - edit", async () => {
    let editPost = JSON.parse(JSON.stringify(post));
    editPost = {...post,description: "title2", postId: post._id};
    const response = await request(app)
                            .put("/post/edit")
                            .set("Authorization", "JWT " + accessToken)
                            .send(editPost);
    expect(response.statusCode).toBe(200);
    const postObj = response.body;
    expect(postObj.description).toBe(editPost.description);
  });

  test("Test PUT Post - required field is missing  ", async () => {
    const missedFieldPost: IPost = JSON.parse(JSON.stringify(post));
    missedFieldPost['breed'] = "";
    const response = await request(app)
                            .put("/post/edit")
                            .set("Authorization", "JWT " + accessToken)
                            .send(missedFieldPost);
    expect(response.statusCode).toBe(400);
  });

  test("Test PUT Post - like", async () => {
    const postId = {postId: post._id};
    const response = await request(app)
                            .put("/post/like")
                            .set("Authorization", "JWT " + accessToken)
                            .send(postId);
    expect(response.statusCode).toBe(200);
  });

  test("Test PUT Post - like post that doesn't exist", async () => {
    const postId = {postId: user._id};
    const response = await request(app)
                            .put("/post/like")
                            .set("Authorization", "JWT " + accessToken)
                            .send(postId);
    expect(response.statusCode).toBe(400);
  });

  test("Test PUT Post - dislike", async () => {
    const postId = {postId: post._id};
    const response = await request(app)
                            .put("/post/dislike")
                            .set("Authorization", "JWT " + accessToken)
                            .send(postId);
    expect(response.statusCode).toBe(200);
  });

  test("Test PUT Post - dislike post that doesn't exist", async () => {
    const postId = {postId: user._id};
    const response = await request(app)
                            .put("/post/like")
                            .set("Authorization", "JWT " + accessToken)
                            .send(postId);
    expect(response.statusCode).toBe(400);
  });

  const addComment = async (comment: IComment) => {
    const response = await request(app)
      .post("/post/comment")
      .set("Authorization", "Bearer " + accessToken)
      .send(comment);

    return response;
  };

  test("Test POST Comment", async () => {
    comment = {...comment, ownerId: user._id, postId: post._id}
    const response = await addComment(comment);
    expect(response.status).toBe(201);
    expect(response.body.newComment.text).toBe(comment.text);
  });

  test("Test POST Comment - required field is missing  ", async () => {
    const missedFieldComment: IComment = JSON.parse(JSON.stringify(post));
    missedFieldComment['text'] = "";
    const response = await addComment(missedFieldComment);
    expect(response.status).toBe(400);
  });

  test("Test GET Comments", async () => {
    const response = await request(app)
                            .get("/post/comments/"+post._id)
                            .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    const commentObj = response.body[0];
    expect(commentObj.comment).toBe(comment.text);
  });

  test("Test DELETE Post", async () => {
    const response = await request(app)
                            .delete("/post/delete/"+post._id)
                            .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
  });

});
