"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const comment_controller_1 = __importDefault(require("../controllers/comment_controller"));
const image_middleware_1 = require("../common/image_middleware");
const router = express_1.default.Router();
router.get("/allByUser/:page", auth_middleware_1.default, post_controller_1.default.getUserPosts.bind(post_controller_1.default));
router.get("/feed/:page", auth_middleware_1.default, post_controller_1.default.getFeedPosts.bind(post_controller_1.default));
router.get("/comments/:id", auth_middleware_1.default, comment_controller_1.default.getPostComments.bind(comment_controller_1.default));
router.post("/create", auth_middleware_1.default, image_middleware_1.imageUploadMiddleware, post_controller_1.default.createPost.bind(post_controller_1.default));
router.post("/comment", auth_middleware_1.default, comment_controller_1.default.createComment.bind(comment_controller_1.default));
router.put("/edit", auth_middleware_1.default, post_controller_1.default.editById.bind(post_controller_1.default));
router.put("/like", auth_middleware_1.default, post_controller_1.default.like.bind(post_controller_1.default));
router.put("/dislike", auth_middleware_1.default, post_controller_1.default.dislike.bind(post_controller_1.default));
router.delete("/delete/:id", auth_middleware_1.default, post_controller_1.default.deletePostById.bind(post_controller_1.default));
exports.default = router;
//# sourceMappingURL=post_route.js.map