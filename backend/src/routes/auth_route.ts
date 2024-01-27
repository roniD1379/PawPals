import express from "express";
import authController from "../controllers/auth_controller";
import { imageUploadMiddleware } from "../common/image_middleware";
import authMiddleware from "../common/auth_middleware";

const router = express.Router();

/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/


/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
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
* /auth/register:
*   post:
*     summary: registers a new user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The new user.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       400:
*         description: Bad request. Vaildation tests failed.
*
*       406:
*         description: Username already exists.
*
*       500:
*         description: Server error.
*/

router.post("/register", imageUploadMiddleware, authController.register);

/**
* @swagger
* components:
*   schemas:
*     Tokens:
*       type: object
*       required:
*         - accessToken
*         - refreshToken
*       properties:
*         accessToken:
*           type: string
*           description: The JWT access token
*         refreshToken:
*           type: string
*           description: The JWT refresh token
*       example:
*         accessToken: '123cd123x1xx1'
*         refreshToken: '134r2134cr1x3c'
*/

/**
* @swagger
* /auth/login:
*   post:
*     summary: login user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The acess & refresh tokens
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Tokens'
*       400:
*         description: Bad request. Vaildation tests failed.
*
*       500:
*         description: Server error.
*/

router.post("/login", authController.login);

router.post("/googleLogin", authController.googleLogin);

/**
* @swagger
* /auth/logout:
*   post:
*     summary: logout a user
*     tags: [Auth]
*     description: need to provide the refresh token in the auth header
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Logout completed successfully
*      
*       401:
*         description: Lacks valid authentication credentials for the requested resource
*
*       500:
*         description: Server error.
*/

router.post("/logout", authController.logout);

router.post("/refresh", authController.refresh);

export default router;
