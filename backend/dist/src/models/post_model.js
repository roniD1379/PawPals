"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    breed: {
        type: String,
        required: true,
    },
    userIdOwner: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    likes: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("Post", postSchema, "Posts");
//# sourceMappingURL=post_model.js.map