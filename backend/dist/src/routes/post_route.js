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
/**
* @swagger
* tags:
*   name: Post
*   description: The Post API
*/
/**
* @swagger
* components:
*   schemas:
*     Post:
*       type: object
*       required:
*         - description
*         - breed
          - breedId
          - ownerId
*       properties:
*         description:
*           type: string
*           description: Post's description
*         breed:
*           type: string
*           description: Breed of the pet
          breedId:
*           type: number
*           description: Breed id of the pet
          image:
*           type: string
*           description: Image of the post
          ownerId:
*           type: mongo.ObjectId
*           description: User id of the post owner
*       example:
*         description: "title1",
          breed: "test",
          breedId: 2,
          ownerId: ObjectId("507f1f77bcf86cd799439011")
*/
/**
 * @swagger
 * definitions:
    formatPost:
      type: object
      properties:
        _id:
          type: mongo.ObjectId()
          description: User id of the post owner
        description:
          type: string
          description: Post's description,
        img:
          type: string
          description: Post's image,
        breed:
*           type: string
*           description: Breed of the pet
        breedId:
*           type: number
*           description: Breed id of the pet
        ownerId:
*           type: mongo.ObjectId
*           description: User id of the post owner
        createdAt:
            type: date
*           description: Post's creation date
        ownerUsername:
            type: string
*           description: Username of the post owner
        ownerFirstName:
            type: string
*           description: Firstname of the post owner
        ownerPhoneNumber:
            type: string
*           description: Phone number of the post owner
        isLikedByUser:
            type: bool
*           description: Is the user mark 'like' on the post or not
        isPostOwner:
            type: bool
*           description: Is the user is the owner of the post
        numOfLikes:
            type: number
*           description: How many users marked 'like' on the post
        numOfComments:
            type: number
*           description: How many comments there are on the post

    formattedPosts:
      type: array
      items:
        type: formatPost
 *
 *
 */
/**
* @swagger
* /post/allByUser/:page:
*   get:
*     summary: Get all user's posts sorted by latest date
*     tags: [Post]
      security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The user's posts.
*         content:
*           application/json:
*             schema:
                $ref: '#/definitions/formattedPosts'
*
        500:
*         description: Server error.
*/
router.get("/allByUser/:page", auth_middleware_1.default, post_controller_1.default.getUserPosts.bind(post_controller_1.default));
/**
* @swagger
* /post/feed/:page:
*   get:
*     summary: Get posts sorted by latest date
*     tags: [Post]
      security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Posts.
*         content:
*           application/json:
*             schema:
                $ref: '#/definitions/formattedPosts'
*
        500:
*         description: Server error.
*/
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