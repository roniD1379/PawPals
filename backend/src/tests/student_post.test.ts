import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose, { model } from "mongoose";
import Post, { IPost } from "../models/post_model";
import User, { IUser } from "../models/user_model";
import userController from "../controllers/user_controller";

let app: Express;
const user: IUser = {
  username: "alonl",
  password: "1234567890",
  firstname: "alon",
  lastname: "levi",
  phoneNumber: "050-0000000"
}
let accessToken = "";

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await Post.deleteMany();

  await User.deleteMany({ 'username': user.username });
  const response = await request(app).post("/auth/register").send(user);
  user._id = response.body._id;
  const response2 = await request(app).post("/auth/login").send(user);
  accessToken = response2.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

getId(async() => {
  await request(app)
    .get("/alonl")
})



const post1: IPost = {
  description: "title1",
  breed: "golden",
  
  userIdOwner: await request(app).post("/user/get").send(user),
};

describe("Student post tests", () => {
  const addStudentPost = async (post: IPost) => {
    const response = await request(app)
      .post("/studentpost")
      .set("Authorization", "JWT " + accessToken)
      .send(post);
    expect(response.statusCode).toBe(201);
    expect(response.body.owner).toBe(user._id);
    expect(response.body.title).toBe(post.title);
    expect(response.body.message).toBe(post.message);
  };

  test("Test Get All Student posts - empty response", async () => {
    const response = await request(app).get("/studentpost");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test("Test Post Student post", async () => {
    addStudentPost(post1);
  });

  test("Test Get All Students posts with one post in DB", async () => {
    const response = await request(app).get("/studentpost");
    expect(response.statusCode).toBe(200);
    const rc = response.body[0];
    expect(rc.title).toBe(post1.title);
    expect(rc.message).toBe(post1.message);
    expect(rc.owner).toBe(user._id);
  });

});
function getId(arg0: () => Promise<void>) {
  throw new Error("Function not implemented.");
}

