import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User, { IUser } from "../models/user_model";

let app: Express;
let accessToken: string;
const user: IUser = {
  username: "alonee",
  password: "1234567890",
  firstname: "alon",
  lastname: "test",
  phoneNumber: "050-0000000"
}

const stu: IUser = {
  username: "alony",
  password: "1234567890",
  firstname: "alon",
  lastname: "test",
  phoneNumber: "050-0000000"
}

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await User.deleteMany();

  User.deleteMany({ 'username': user.username });
  await request(app).post("/auth/register").send(user);
  const response = await request(app).post("/auth/login").send(user);
  accessToken = response.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("user tests", () => {

  const adduser = async (userrInp: IUser) => {
    const response = await request(app).post("/user")
      .set("Authorization", "JWT " + accessToken)
      .send(userrInp);
    expect(response.statusCode).toBe(201);
  };


  test("Test Post user", async () => {
    adduser(stu);
  });

  test("Test Post duplicate user", async () => {
    const response = await request(app).post("/user").set("Authorization", "JWT " + accessToken).send(user);
    expect(response.statusCode).toBe(406);
  });

  // test("Test PUT /user/:id", async () => {
  //   const updateduser = { ...user, name: "Jane Doe 33" };
  //   const response = await request(app)
  //     .put(`/user/${user._id}`)
  //     .send(updateduser);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.name).toBe(updateduser.name);
  // });

  // test("Test DELETE /user/:id", async () => {
  //   const response = await request(app).delete(`/user/${user._id}`);
  //   expect(response.statusCode).toBe(200);
  // });
});