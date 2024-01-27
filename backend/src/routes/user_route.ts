import express from "express";
const router = express.Router();
import userController from "../controllers/user_controller";
import authMiddleware from "../common/auth_middleware";
import { imageUploadMiddleware } from "../common/image_middleware";

/**
* @swagger
* tags:
*   name: User
*   description: The User API
*/

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - username
*         - password
*         - firstName
*         - lastName
*         - phoneNumber
*       properties:
*         username:
*           type: string
*           description: The user username, can only contain letters and numbers and must be at least 6 characters long
*         password:
*           type: string
*           description: The user password, must contain letters and numbers and must be at least 6 characters long
*         firstName:
*           type: string
*           description: The user first name
*         lastName:
*           type: string
*           description: The user last name
*         phoneNumber:
*           type: string
*           description: The user phone number
*       example:
*         email: 'bobi25'
*         password: 'A123456'
*/

/**
* @swagger
* /user/details:
*   get:
*     summary: Get user details
*     tags: [User]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The user details.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       500:
*         description: Server error.
*/

router.get(
  "/details",
  authMiddleware,
  userController.getUserDetails.bind(userController)
);

/**
* @swagger
* /user/edit:
*   put:
*     summary: Edit user details
*     tags: [User]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The user updated details.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       400:
*         description: Bad request. Vaildation tests failed.
*       500:
*         description: Server error.
*/

router.put(
  "/edit",
  authMiddleware,
  imageUploadMiddleware,
  userController.editUserDetails.bind(userController)
);

/**
* @swagger
* /user/delete:
*   delete:
*     summary: delete user
*     tags: [User]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The user delete successfully.
*       400:
*         description: Bad request. User not found.
*       500:
*         description: Server error.
*/

router.delete(
  "/delete",
  authMiddleware,
  userController.deleteUser.bind(userController)
);

export default router;
