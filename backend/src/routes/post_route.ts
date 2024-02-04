import express from "express";
import postController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";
import commentController from "../controllers/comment_controller";
import { imageUploadMiddleware } from "../common/image_middleware";

const router = express.Router();

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
 *         - breedId
 *         - image
 *         - ownerId
 *       properties:
 *         description:
 *           type: string
 *           description: Post's description
 *         breed:
 *           type: string
 *           description: Breed of the pet
 *         breedId:
 *           type: number
 *           description: Breed id of the pet
 *         image:
 *           type: string
 *           description: Image of the post
 *         ownerId:
 *           type: mongo.ObjectId
 *           description: User id of the post owner
 *       example:
 *         description: "title1"
 *         breed: "test"
 *         breedId: 2
 *         ownerId: ObjectId("507f1f77bcf86cd799439011")
 *         image: 'dog.png'
 *
 *     EditPost:
 *       type: object
 *       required:
 *         - description
 *         - breed
 *         - breedId
 *         - image
 *       properties:
 *         description:
 *           type: string
 *           description: Post's description
 *         breed:
 *           type: string
 *           description: Breed of the pet
 *         breedId:
 *           type: number
 *           description: Breed id of the pet
 *         image:
 *           type: string
 *           description: Image of the post
 *       example:
 *         description: "title1"
 *         breed: "test"
 *         breedId: 2
 *         image: 'dog.png'
 *
 *     PostId:
 *       type: object
 *       required:
 *         - postId
 *       properties:
 *         postId:
 *           type: mongo.ObjectId
 *           description: Post id
 *       example:
 *         postId: ObjectId("507f1f77bcf86cd799439011")
 *
 *     Comment:
 *       type: object
 *       required:
 *         - text
 *         - ownerId
 *         - postId
 *       properties:
 *         text:
 *           type: string
 *           description: comments's text
 *         ownerId:
 *           type: mongo.ObjectId
 *           description: User id of the comment owner
 *         postId:
 *           type: mongo.ObjectId
 *           description: post id related to the comment
 *       example:
 *         text: "comment1"
 *         ownerId: ObjectId("507f1f77bcf86cd799439011")
 *         postId: ObjectId("507f1f77bcf86cd799439012")
 */

/**
 * @swagger
 * definitions:
 *   formatPost:
 *     type: object
 *     properties:
 *       _id:
 *         type: mongo.ObjectId()
 *         description: User id of the post owner
 *       description:
 *         type: string
 *         description: Post's description,
 *       img:
 *         type: string
 *         description: Post's image,
 *       breed:
 *         type: string
 *         description: Breed of the pet
 *       breedId:
 *         type: number
 *         description: Breed id of the pet
 *       ownerId:
 *         type: mongo.ObjectId
 *         description: User id of the post owner
 *       createdAt:
 *         type: date
 *         description: Post's creation date
 *       ownerUsername:
 *         type: string
 *         description: Username of the post owner
 *       ownerFirstName:
 *         type: string
 *         description: First name of the post owner
 *       ownerPhoneNumber:
 *         type: string
 *         description: Phone number of the post owner
 *       isLikedByUser:
 *         type: bool
 *         description: Is the user mark 'like' on the post or not
 *       isPostOwner:
 *         type: bool
 *         description: Is the user is the owner of the post
 *       numOfLikes:
 *         type: number
 *         description: How many users marked 'like' on the post
 *       numOfComments:
 *         type: number
 *         description: How many comments there are on the post
 *
 *   formattedPosts:
 *     type: array
 *     items:
 *       type: formatPost
 *
 *   formatComment:
 *     type: object
 *     properties:
 *       ownerUsername:
 *         type: string
 *         description: Username of the comment's owner
 *       comment:
 *         type: string
 *         description: Data of the comment
 *       createdAt:
 *         type: date
 *         description: Creation date of the comment
 *
 *
 *   formattedComments:
 *     type: array
 *     items:
 *       type: formatComment
 */

/**
 * @swagger
 * /post/allByUser/:page:
 *   get:
 *     tags: [Post]
 *     summary: Get all user's posts sorted by latest date. Page is a numeric variable that represent the wanted page.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's posts.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/formattedPosts'
 *       500:
 *         description: Server error.
 */

router.get(
  "/allByUser/:page",
  authMiddleware,
  postController.getUserPosts.bind(postController)
);

/**
 * @swagger
* /post/feed/:page:
*   get:
*     summary: Get posts sorted by the latest date. Page is a numeric variable that represent the wanted page.
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Posts.
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/formattedPosts'
*       500:
*         description: Server error.

 */

router.get(
  "/feed/:page",
  authMiddleware,
  postController.getFeedPosts.bind(postController)
);

/**
 * @swagger
 *   /post/comments/:id:
 *     get:
 *       summary: Get comments of post. Id is a variable that represent the post id that related to the comment.
 *       tags: [Post]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: comments of post.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/formattedComments'
 *         500:
 *           description: Server error.
 */

router.get(
  "/comments/:id",
  authMiddleware,
  commentController.getPostComments.bind(commentController)
);

/**
 * @swagger
 * /post/create:
 *   post:
 *     summary: create a new post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: The new post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request. Validation tests failed.
 *
 *       500:
 *         description: Server error.
 */

router.post(
  "/create",
  authMiddleware,
  imageUploadMiddleware,
  postController.createPost.bind(postController)
);

/**
 * @swagger
 * /post/comment:
 *   post:
 *     summary: create a new comment
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: The new comment.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *
 *       500:
 *         description: Server error.
 */

router.post(
  "/comment",
  authMiddleware,
  commentController.createComment.bind(commentController)
);

/**
 * @swagger
 * /post/edit:
 *   put:
 *     summary: Edit post details
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditPost'
 *     responses:
 *       200:
 *         description: The post updated details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EditPost'
 *
 *       400:
 *         description: Bad request. Validation tests failed.
 *
 *       500:
 *         description: Server error.
 */

router.put(
  "/edit",
  authMiddleware,
  postController.editById.bind(postController)
);

/**
 * @swagger
 * /post/like:
 *   put:
 *     summary: Mark like to post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostId'
 *     responses:
 *       200:
 *         description: The post has been marked as 'liked' successfully.
 *
 *       500:
 *         description: Server error.
 */

router.put("/like", authMiddleware, postController.like.bind(postController));

/**
 * @swagger
 * /post/dislike:
 *   put:
 *     summary: Mark dislike to post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostId'
 *     responses:
 *       200:
 *         description: The post has been marked as 'disliked' successfully.
 *
 *       500:
 *         description: Server error.
 */

router.put(
  "/dislike",
  authMiddleware,
  postController.dislike.bind(postController)
);

/**
 * @swagger
 * /post/delete:
 *   delete:
 *     summary: delete post and its comments
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostId'
 *     responses:
 *       200:
 *         description: The post has been successfully deleted.
 *
 *       400:
 *         description: Bad request. Post not found.
 *
 *       500:
 *         description: Server error.
 */

router.delete(
  "/delete/:id",
  authMiddleware,
  postController.deletePostById.bind(postController)
);

export default router;
