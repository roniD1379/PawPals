import express from "express";
const router = express.Router();
import userController from "../controllers/user_controller";
import authMiddleware from "../common/auth_middleware";
import { imageUploadMiddleware } from "../common/image_middleware";

router.get(
  "/details",
  authMiddleware,
  userController.getUserDetails.bind(userController)
);

router.put(
  "/edit",
  authMiddleware,
  imageUploadMiddleware,
  userController.editUserDetails.bind(userController)
);

export default router;
