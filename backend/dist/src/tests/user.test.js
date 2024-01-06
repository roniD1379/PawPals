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
    username: "alonee",
    password: "1234567890",
    firstname: "alon",
    lastname: "test",
    phoneNumber: "050-0000000"
};
const stu = {
    username: "alony",
    password: "1234567890",
    firstname: "alon",
    lastname: "test",
    phoneNumber: "050-0000000"
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteMany();
    user_model_1.default.deleteMany({ 'username': user.username });
    yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("user tests", () => {
    const adduser = (userrInp) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/user")
            .set("Authorization", "JWT " + accessToken)
            .send(userrInp);
        expect(response.statusCode).toBe(201);
    });
    test("Test Post user", () => __awaiter(void 0, void 0, void 0, function* () {
        adduser(stu);
    }));
    test("Test Post duplicate user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/user").set("Authorization", "JWT " + accessToken).send(user);
        expect(response.statusCode).toBe(406);
    }));
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
//# sourceMappingURL=user.test.js.map