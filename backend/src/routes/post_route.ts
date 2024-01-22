import express from "express";
const router = express.Router();
import postController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";
import commentController from "../controllers/comment_controller";
import { imageUploadMiddleware } from "../common/image_middleware";

router.get(
  "/all" ,
  authMiddleware,
  postController.get.bind(postController)
);

router.get(
  "/allByUser/:id",
  authMiddleware,
  postController.getAllByUser.bind(postController)
);

router.get("/feed" ,authMiddleware,postController.getTenLatestPosts.bind(postController));

router.get("/:id", authMiddleware, postController.getById.bind(postController));

router.get(
  "/comments/:id",
  authMiddleware,
  commentController.getById.bind(commentController)
);

router.post(
  "/create",
  authMiddleware,
  imageUploadMiddleware,
  postController.createPost.bind(postController)
);

router.post(
  "/comment",
  authMiddleware,
  commentController.post.bind(commentController)
);

router.put(
  "/edit",
  authMiddleware,
  postController.putById.bind(postController)
);

router.put("/like", authMiddleware, postController.like.bind(postController));

router.put(
  "/dislike",
  authMiddleware,
  postController.dislike.bind(postController)
);

router.delete(
  "/delete",
  authMiddleware,
  postController.deleteById.bind(postController)
);

export default router;
