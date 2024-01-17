import express from "express";
const router = express.Router();
import postController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";
import commentController from "../controllers/comment_controller";

router.get("/all" ,authMiddleware,postController.get.bind(postController));

router.get("/:id", authMiddleware, postController.getById.bind(postController));

router.post("/create", authMiddleware, postController.post.bind(postController));

router.put("/edit/:id", authMiddleware, postController.putById.bind(postController));

router.put("/like/:id", authMiddleware, postController.like.bind(postController));

router.put("/dislike/:id", authMiddleware, postController.dislike.bind(postController));

router.put("/comment/:id", authMiddleware, commentController.post.bind(postController));

router.get("/comments/:id", authMiddleware, commentController.get.bind(postController));

router.delete("/:id", authMiddleware, postController.deleteById.bind(postController));

export default router;
