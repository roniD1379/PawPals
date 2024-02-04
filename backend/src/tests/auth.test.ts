import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User, { IUser } from "../models/user_model";

let app: Express;
const user: IUser = {
  username: "alonCee",
  password: "a1234567890",
  firstName: "alon",
  lastName: "test",
  phoneNumber: "050-0000000",
};

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
});

afterAll(async () => {
  await User.deleteOne({ username: user.username });
  await mongoose.connection.close();
});

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string;

describe("Auth tests", () => {
  test("Test Register", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(201);
  });

  test("Test Register exist username", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(406);
  });

  test("Test Register missing password", async () => {
    const response = await request(app).post("/auth/register").send({
      username: "alonMee",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test Register fail - required field is missing (firstName)", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ ...user, firstName: "" });
    expect(response.statusCode).toBe(400);
  });

  test("Test Register fail - required field is missing (lastName)", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ ...user, lastName: "" });
    expect(response.statusCode).toBe(400);
  });

  test("Test Register fail - required field is missing (phoneNumber)", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ ...user, phoneNumber: "" });
    expect(response.statusCode).toBe(400);
  });

  test("Test Register fail - invalid username", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ ...user, username: "test" });
    expect(response.statusCode).toBe(400);
  });

  test("Test Login", async () => {
    const response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(200);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
  });

  test("Test Login fail - required field is missing (username)", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ ...user, username: "" });
    expect(response.statusCode).toBe(400);
  });

  test("Test Login fail - required field is missing (password)", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ ...user, password: "" });
    expect(response.statusCode).toBe(400);
  });

  test("Test Login fail - incorrect username", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ ...user, username: "klhasd" });
    expect(response.statusCode).toBe(400);
  });

  test("Test Login fail - incorrect password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ ...user, password: "ajskd" });
    expect(response.statusCode).toBe(400);
  });

  test("Test forbidden access without token", async () => {
    const response = await request(app).get("/user/details");
    expect(response.statusCode).toBe(401);
  });

  test("Test access with valid token", async () => {
    const response = await request(app)
      .get("/user/details")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
  });

  test("Test access with invalid token", async () => {
    const response = await request(app)
      .get("/user/details")
      .set("Authorization", "JWT 1" + accessToken);
    expect(response.statusCode).toBe(401);
  });

  jest.setTimeout(10000);

  test("Test access after timeout of token", async () => {
    await new Promise((resolve) => setTimeout(() => resolve("done"), 5000));

    const response = await request(app)
      .get("/user/details")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).not.toBe(200);
  });

  test("Test refresh token", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: refreshToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    const newAccessToken = response.body.accessToken;
    newRefreshToken = response.body.refreshToken;

    const response2 = await request(app)
      .get("/user/details")
      .set("Authorization", "JWT " + newAccessToken);
    expect(response2.statusCode).toBe(200);
  });

  test("Test double use of refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response.statusCode).not.toBe(200);

    //verify that the new token is not valid as well
    const response1 = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + newRefreshToken)
      .send();
    expect(response1.statusCode).not.toBe(200);
  });

  test("Test logout", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .send({ refreshToken: newRefreshToken });
    expect(response.statusCode).toBe(200);
  });

  test("Test logout fail - missing refresh token", async () => {
    const response = await request(app).post("/auth/logout").send({});
    expect(response.statusCode).toBe(401);
  });

  test("Test logout fail - invalid refresh token", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .send({ refreshToken: "djklahsdhjkasjdklajldjaljd" });
    expect(response.statusCode).toBe(401);
  });

  test("Test refresh token - missing refresh token", async () => {
    const response = await request(app).post("/auth/refresh").send({});
    expect(response.statusCode).toBe(401);
  });

  test("Test refresh token fail - invalid refresh token", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: "djklahsdhjkasjdklajldjaljd" });
    expect(response.statusCode).toBe(401);
  });

  test("Test refresh token fail - token is not in user's refresh tokens", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: refreshToken });
    expect(response.statusCode).toBe(401);
  });

  test("Test google login - fail - missing credentials", async () => {
    const response = await request(app)
      .post("/auth/googleLogin")
      .send({ credential: "" });
    expect(response.statusCode).toBe(500);
  });
});
