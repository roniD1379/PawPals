import express from "express";
const router = express.Router();
import userController from "../controllers/user_controller";
import authMiddleware from "../common/auth_middleware";

router.get(
  "/details",
  authMiddleware,
  userController.getUserDetails.bind(userController)
);

router.post("/", authMiddleware, userController.post.bind(userController));

router.put(
  "/edit",
  authMiddleware,
  userController.putById.bind(userController)
);

router.delete(
  "/delete",
  authMiddleware,
  userController.deleteById.bind(userController)
);

export default router;
