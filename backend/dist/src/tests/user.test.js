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
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
let accessToken;
const user = {
    username: "alonRee",
    password: "a1234567890",
    firstName: "alon",
    lastName: "test",
    phoneNumber: "050-0000000",
};
const user2 = {
    username: "alonPee",
    password: "a1234567890",
    firstName: "alon",
    lastName: "test",
    phoneNumber: "050-0000000",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteOne({ username: user.username });
    yield user_model_1.default.deleteOne({ username: user2.username });
    yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("User tests", () => {
    const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send(user);
        expect(response.statusCode).toBe(201);
    });
    test("Test POST User", () => __awaiter(void 0, void 0, void 0, function* () {
        yield addUser(user2);
    }));
    test("Test POST Duplicate User", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send(user);
        expect(response.statusCode).toBe(406);
    }));
    test("Test GET User", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/user/details")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        const userObj = response.body;
        expect(userObj.username).toBe(user.username);
    }));
    test("Test PUT User", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = Object.assign(Object.assign({}, user), { firstName: "Boni" });
        const response = yield (0, supertest_1.default)(app)
            .put("/user/edit")
            .set("Authorization", "JWT " + accessToken)
            .send(updatedUser);
        expect(response.statusCode).toBe(200);
        expect(response.body.firstName).toBe(updatedUser.firstName);
    }));
    test("Test DELETE User", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete("/user/delete/")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    }));
});
//# sourceMappingURL=user.test.js.map