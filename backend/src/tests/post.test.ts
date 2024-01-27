import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import fs from "fs";
import Post, { IPost } from "../models/post_model";
import User, { IUser } from "../models/user_model";

const imagePath = "C:/PawPals/uploads/pet.jpg"
const imageFile = fs.createReadStream(imagePath);

let app: Express;
const user : IUser= {
  username: "alonBee",
  password: "a1234567890",
  firstName: "alon",
  lastName: "test",
  phoneNumber: "050-0000000",
}

const post: IPost = {
  description: "title1",
  breed: "test",
  breedId: 2,
  ownerId: null,
  image: imagePath
};
let accessToken = "";
let formData = null;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");

  await User.deleteOne({username: user.username});
  await Post.deleteOne({breed: post.breed});
  await request(app).post("/auth/register").send(user);
  const response = await request(app).post("/auth/login").send(user);
  accessToken = response.body.accessToken;
  
  // Create a string variable to store the data

  // Listen for the 'data' event and append the data to the string variable
  // imageFile.on('data', (chunk) => {
  //   data += chunk.toString();
  // });

  formData = new FormData();
  formData.append('image',imageFile);
});


afterAll(async () => {
  await mongoose.connection.close();
});

describe("Post tests", () => {

  const addPost = async (post: IPost) => {
      const response = await request(app)
                              .post("/post/create")
                              .set("Authorization", "JWT " + accessToken)
                              .set('image',formData)
                              .send(post);
      console.log(response);
      expect(response.statusCode).toBe(201);
  };

  test("Test POST Post", async () => {
    await addPost(post);
  });


  // test("Test GET Post", async () => {
  //   const response = await request(app)
  //                           .get("/post/details")
  //                           .set("Authorization", "JWT " + accessToken);
  //   expect(response.statusCode).toBe(200);
  //   const postObj = response.body;
  //   expect(postObj.postname).toBe(post.postname);
  // });

  // test("Test PUT Post", async () => {
  //   const updatedPost = { ...post, firstName: "Boni" };
  //   const response = await request(app)
  //                           .put("/post/edit")
  //                           .set("Authorization", "JWT " + accessToken)
  //                           .send(updatedPost);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.firstName).toBe(updatedPost.firstName);
  // });

  // test("Test DELETE Post", async () => {
  //   const response = await request(app)
  //                           .delete("/post/delete/")
  //                           .set("Authorization", "JWT " + accessToken);
  //   expect(response.statusCode).toBe(200);
  // });

});
