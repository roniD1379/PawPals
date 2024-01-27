"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const imagePath = "C:/PawPals/uploads/pet.jpg";
const imageFile = fs_1.default.createReadStream(imagePath);
let app;
const user = {
    username: "alonBee",
    password: "a1234567890",
    firstName: "alon",
    lastName: "test",
    phoneNumber: "050-0000000",
};
const post = {
    description: "title1",
    breed: "test",
    breedId: 2,
    ownerId: null,
    image: imagePath
};
let accessToken = "";
let formData = null;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteOne({ username: user.username });
    yield post_model_1.default.deleteOne({ breed: post.breed });
    yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
    // Create a string variable to store the data
    // Listen for the 'data' event and append the data to the string variable
    // imageFile.on('data', (chunk) => {
    //   data += chunk.toString();
    // });
    formData = new FormData();
    formData.append('image', imageFile);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Post tests", () => {
    const addPost = (post) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/post/create")
            .set("Authorization", "JWT " + accessToken)
            .set('image', formData)
            .send(post);
        console.log(response);
        expect(response.statusCode).toBe(201);
    });
    test("Test POST Post", () => __awaiter(void 0, void 0, void 0, function* () {
        yield addPost(post);
    }));
    // test("Test POST Duplicate Post", async () => {
    //   const response = await request(app)
    //                           .post("/auth/register")
    //                           .send(post);
    //   expect(response.statusCode).toBe(406);
    // });
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
//# sourceMappingURL=post.test.js.map