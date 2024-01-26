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
const user_model_1 = __importDefault(require("../models/user_model"));
const comment_model_1 = __importDefault(require("../models/comment_model"));
const mongoose_1 = require("mongoose");
class PostService {
    deleteRelatedComments(post) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comment_model_1.default.deleteMany({ postId: post._id });
        });
    }
    getNumOfComments(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const numOfComments = yield comment_model_1.default.countDocuments({ postId: post._id });
            return numOfComments;
        });
    }
    getNumOfLikes(post) {
        return post.likes.length;
    }
    getIsPostOwner(post, userId) {
        return post.ownerId.equals(userId);
    }
    getIsLikedByUser(post, userId) {
        return post.likes.includes(userId);
    }
    getOwnerObj(post) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findById(post.ownerId);
        });
    }
    convertToIdObject(id) {
        return new mongoose_1.mongo.ObjectId(id);
    }
    like(post, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.getIsLikedByUser(post, userId)) {
                    throw new Error("already liked by user");
                }
                yield post_model_1.default.findByIdAndUpdate(post._id, {
                    $push: { likes: userId },
                });
            }
            catch (err) {
                throw new Error("Failed to like post: " + err.message);
            }
        });
    }
    dislike(post, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const indexOfUserLike = post.likes.indexOf(userId);
            if (indexOfUserLike > -1) {
                try {
                    yield post_model_1.default.findByIdAndUpdate(post._id, {
                        $pull: { likes: userId },
                    });
                }
                catch (err) {
                    throw new Error("Failed to dislike post: " + err.message);
                }
            }
        });
    }
    formatPost(post, userIdObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const postOwner = yield this.getOwnerObj(post);
            return {
                _id: post._id,
                description: post.description,
                img: post.image,
                breed: post.breed,
                breedId: post.breedId,
                ownerId: post.ownerId,
                createdAt: post.createdAt,
                ownerUsername: postOwner.username,
                ownerFirstName: postOwner.firstName,
                ownerPhoneNumber: postOwner.phoneNumber,
                isLikedByUser: this.getIsLikedByUser(post, userIdObject),
                isPostOwner: this.getIsPostOwner(post, userIdObject),
                numOfLikes: this.getNumOfLikes(post),
                numOfComments: yield this.getNumOfComments(post),
            };
        });
    }
    formatPosts(posts, userIdObject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formattedPosts = yield Promise.all(posts.map((post) => this.formatPost(post, userIdObject)));
                return formattedPosts;
            }
            catch (error) {
                console.error("Error formatting posts:", error);
                throw error;
            }
        });
    }
}
exports.default = new PostService();
//# sourceMappingURL=post_service.js.map