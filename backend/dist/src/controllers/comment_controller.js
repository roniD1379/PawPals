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
const comment_model_1 = __importDefault(require("../models/comment_model"));
const base_controller_1 = require("./base_controller");
const comment_service_1 = __importDefault(require("../services/comment_service"));
class CommentController extends base_controller_1.BaseController {
    constructor() {
        super(comment_model_1.default);
    }
    getPostComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.id;
            if (!postId || postId === "")
                return res.status(400).send("Post ID is required");
            try {
                const postComments = yield comment_model_1.default.find({ postId })
                    .populate("ownerId", "username") // Populate the ownerId field with username
                    .sort({ createdAt: -1 }); // Sort comments by createdAt in descending order
                const formattedComments = postComments.map((comment) => ({
                    ownerUsername: comment.ownerId
                        .username,
                    comment: comment.text,
                    createdAt: comment.createdAt,
                }));
                res.status(200).json(formattedComments);
            }
            catch (err) {
                res.status(500).json("Fail: " + err.message);
            }
        });
    }
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ownerId = req.user._id;
            const text = req.body.text;
            const postId = req.body.postId;
            if (!text || text === "")
                return res.status(400).send("Comment text is required");
            if (!postId || postId === "")
                return res.status(400).send("Post ID is required");
            try {
                const newComment = yield comment_model_1.default.create({
                    postId: postId,
                    text: text,
                    ownerId: ownerId,
                });
                const commentOwner = yield comment_service_1.default.getOwnerObj(newComment);
                console.log("Comment created successfully");
                res
                    .status(201)
                    .send({ newComment: newComment, ownerUsername: commentOwner.username });
            }
            catch (err) {
                res.status(500).send("Fail: " + err.message);
            }
        });
    }
}
exports.default = new CommentController();
//# sourceMappingURL=comment_controller.js.map