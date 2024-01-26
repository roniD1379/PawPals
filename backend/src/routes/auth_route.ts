import express from "express";
import authController from "../controllers/auth_controller";
import { imageUploadMiddleware } from "../common/image_middleware";
import authMiddleware from "../common/auth_middleware";

const router = express.Router();

router.post("/register", imageUploadMiddleware, authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/googleLogin", authController.googleLogin);

router.get("/refresh", authMiddleware, authController.refresh);

export default router;
