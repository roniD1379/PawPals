import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User, { IUser } from "../models/user_model";
import { Express } from "express";

let app: Express;
let accessToken: string;
const user = {
  username: "alonRee",
  password: "a1234567890",
  firstName: "alon",
  lastName: "test",
  phoneNumber: "050-0000000",
};

const user2: IUser = {
  username: "alonPee",
  password: "a1234567890",
  firstName: "alon",
  lastName: "test",
  phoneNumber: "050-0000000",
};

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");

  await request(app).post("/auth/register").send(user);
  const response = await request(app).post("/auth/login").send(user);
  accessToken = response.body.accessToken;
});

afterAll(async () => {
  await User.deleteOne({ username: user.username });
  await User.deleteOne({ username: user2.username });
  await mongoose.connection.close();
});

describe("User tests", () => {
  const addUser = async (user: IUser) => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(201);
  };

  test("Test POST User", async () => {
    await addUser(user2);
  });

  test("Test POST Duplicate User", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(406);
  });

  test("Test GET User", async () => {
    const response = await request(app)
      .get("/user/details")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    const userObj = response.body;
    expect(userObj.username).toBe(user.username);
  });

  test("Test PUT User", async () => {
    const updatedUser = { ...user, firstName: "Boni" };
    const response = await request(app)
      .put("/user/edit")
      .set("Authorization", "JWT " + accessToken)
      .send(updatedUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.firstName).toBe(updatedUser.firstName);
  });

  test("Test PUT User - required field is missing  ", async () => {
    const missedFieldUser: IUser = JSON.parse(JSON.stringify(user));
    missedFieldUser['firstName'] = "";
    const response = await request(app)
                            .put("/user/edit")
                            .set("Authorization", "JWT " + accessToken)
                            .send(missedFieldUser);
    expect(response.statusCode).toBe(400);
  });

  test("Test DELETE User", async () => {
    const response = await request(app)
      .delete("/user/delete/")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
  });
});
