"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const comment = new mongoose_1.Schema({
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    }
});
exports.default = (0, mongoose_1.model)("Comment", comment, "Comments");
//# sourceMappingURL=comment_model.js.map