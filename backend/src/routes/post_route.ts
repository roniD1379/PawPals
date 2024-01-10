import express from "express";
const router = express.Router();
import postController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/" ,postController.get.bind(postController));

router.get("/:id", postController.getById.bind(postController));

router.post("/", authMiddleware, postController.post.bind(postController));

router.put("/:id", authMiddleware, postController.putById.bind(postController));

router.delete("/:id", authMiddleware, postController.deleteById.bind(postController));

export default router;
