"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_route_1 = __importDefault(require("./routes/user_route"));
const post_route_1 = __importDefault(require("./routes/post_route"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const initApp = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.once("open", () => console.log("Connected to Database"));
        db;
        db.on("error", (error) => console.error(error));
        const url = process.env.DB_URL;
        console.log(url);
        mongoose_1.default.connect(url, { user: process.env.DB_USERNAME, pass: process.env.DB_PASSWORD, dbName: process.env.DB_NAME }).then(() => {
            const app = (0, express_1.default)();
            app.use(body_parser_1.default.json());
            app.use(body_parser_1.default.urlencoded({ extended: true }));
            app.use("/user", user_route_1.default);
            app.use("/post", post_route_1.default);
            app.use("/auth", auth_route_1.default);
            resolve(app);
        });
    });
    return promise;
};
exports.default = initApp;
//# sourceMappingURL=app.js.map