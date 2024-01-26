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
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
const user = {
    _id: null,
    username: "alonBee",
    password: "a1234567890",
    firstName: "alon",
    lastName: "test",
    phoneNumber: "050-0000000",
};
const post = {
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
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield post_model_1.default.deleteOne({ breed: post.breed });
    yield user_model_1.default.deleteOne({ username: user.username });
    const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    user._id = response.body._id;
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = response2.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Post tests", () => {
    const addPost = (post) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/post/create")
            .set("Authorization", "JWT " + accessToken)
            .send(post);
        expect(response.statusCode).toBe(201);
        const rs = response.body[0];
        expect(rs.ownerId).toBe(user._id);
        expect(rs.description).toBe(post.description);
        expect(rs.breed).toBe(post.breed);
        expect(rs.breedId).toBe(post.breedId);
    });
    test("Test Get All User Posts - Empty Response", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/post/allByUser/" + user._id)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Test POST post", () => __awaiter(void 0, void 0, void 0, function* () {
        addPost(post);
    }));
    test("Test Get All User's Posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/post/allByUser/" + user._id)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        const rs = response.body;
        console.log(response);
        expect(rs.ownerId).toBe(user._id);
        expect(rs.description).toBe(post.description);
        expect(rs.breed).toBe(post.breed);
        expect(rs.breedId).toBe(post.breedId);
    }));
});
//# sourceMappingURL=post.test.js.map