"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userImage: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    refreshTokens: {
        type: [String],
        required: false,
    },
    authSource: {
        type: String,
        enum: ["self", "google"],
        default: "self",
    },
});
exports.default = (0, mongoose_1.model)("User", userSchema, "Users");
//# sourceMappingURL=user_model.js.map