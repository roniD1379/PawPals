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
const post_model_1 = __importDefault(require("../models/post_model"));
const base_controller_1 = require("./base_controller");
const post_service_1 = __importDefault(require("../services/post_service"));
const post_model_2 = __importDefault(require("../models/post_model"));
const post_service_2 = __importDefault(require("../services/post_service"));
const FEED_PAGE_SIZE = 5;
const PROFILE_FEED_PAGE_SIZE = 12;
class PostController extends base_controller_1.BaseController {
    constructor() {
        super(post_model_1.default);
    }
    getFeedPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userIdObject = post_service_1.default.convertToIdObject(req.user._id);
                let posts = [];
                const page = req.params.page ? parseInt(req.params.page) : 1;
                const skip = page === 0 ? 0 : (page - 1) * FEED_PAGE_SIZE;
                posts = yield post_model_1.default.find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(FEED_PAGE_SIZE);
                const formattedPosts = yield post_service_2.default.formatPosts(posts, userIdObject);
                res.status(200).send(formattedPosts);
            }
            catch (err) {
                console.log("Failed to get feed posts: " + err.message);
                res.status(500).json({ message: err.message });
            }
        });
    }
    getUserPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userIdObject = post_service_1.default.convertToIdObject(req.user._id);
                let posts = [];
                const page = req.params.page ? parseInt(req.params.page) : 1;
                const skip = page === 0 ? 0 : (page - 1) * PROFILE_FEED_PAGE_SIZE;
                posts = yield post_model_1.default.find({ ownerId: userIdObject })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(PROFILE_FEED_PAGE_SIZE);
                const formattedPosts = yield post_service_2.default.formatPosts(posts, userIdObject);
                res.status(200).send(formattedPosts);
            }
            catch (err) {
                console.log("Failed to get user posts: " + err.message);
                res.status(500).json({ message: err.message });
            }
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = req.file.filename;
            const description = req.body.description;
            const breed = req.body.breed;
            const breedId = req.body.breedId;
            if (!filename || filename === "")
                return res.status(400).send("Image is required");
            if (!description || description === "")
                return res.status(400).send("Description is required");
            if (!breed || breed === "")
                return res.status(400).send("Breed is required");
            if (!breedId)
                return res.status(400).send("Breed is required");
            try {
                const post = yield post_model_2.default.create({
                    description: description,
                    image: filename,
                    breed: breed,
                    breedId: Number.parseInt(breedId),
                    ownerId: req.user._id,
                    likes: [],
                });
                console.log("Post created successfully");
                res.status(201).send(post);
            }
            catch (err) {
                res.status(500).send("Fail: " + err.message);
            }
        });
    }
    like(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = post_service_1.default.convertToIdObject(req.user._id);
                const postObj = yield post_model_1.default.findById(req.body.postId);
                if (!postObj)
                    return res.status(400).send("Post not found");
                yield post_service_1.default.like(postObj, userId);
                res.status(200).send();
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    dislike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = post_service_1.default.convertToIdObject(req.user._id);
                const postObj = yield post_model_1.default.findById(req.body.postId);
                if (!postObj)
                    return res.status(400).send("Post not found");
                yield post_service_1.default.dislike(postObj, userId);
                res.status(200).send();
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    deletePostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.id;
            if (!postId || postId === "")
                return res.status(400).send("Post ID is required");
            try {
                const postObj = yield post_model_1.default.findById(postId);
                if (!postObj)
                    return res.status(400).send("Post not found");
                if (postObj.ownerId.toString() !== req.user._id)
                    return res.status(401).send("Unauthorized"); // You can not delete a post that is not yours
                // Deleting the post and it's comments
                yield post_model_1.default.deleteOne({ _id: postObj._id });
                post_service_1.default.deleteRelatedComments(postObj);
                res.status(200).send();
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    editById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.body.postId;
            const description = req.body.description;
            const breed = req.body.breed;
            const breedId = req.body.breedId;
            if (!description || description === "")
                return res.status(400).send("Description is required");
            if (!breed || breed === "")
                return res.status(400).send("Breed is required");
            if (!breedId)
                return res.status(400).send("Breed is required");
            try {
                const updatedPost = yield post_model_1.default.findByIdAndUpdate(postId, {
                    description,
                    breed,
                    breedId,
                }, { new: true });
                if (!updatedPost)
                    return res.status(400).send("Post not found");
                res.status(200).send();
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
}
exports.default = new PostController();
//# sourceMappingURL=post_controller.js.map