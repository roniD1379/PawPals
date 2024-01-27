"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth_controller"));
const image_middleware_1 = require("../common/image_middleware");
const router = express_1.default.Router();
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
          - firstName
          - lastName
          - phoneNumber
*       properties:
*         username:
*           type: string
*           description: The user username
                         Can only contain letters and numbers and must be at least 6 characters long
*         password:
*           type: string
*           description: The user password
                         Must contain letters and numbers and must be at least 6 characters long
          firstName:
*           type: string
*           description: The user first name

          lastName:
*           type: string
*           description: The user last name

          phoneNumber:
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

        500:
*         description: Server error.
*/
router.post("/register", image_middleware_1.imageUploadMiddleware, auth_controller_1.default.register);
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

        500:
*         description: Server error.
*/
router.post("/login", auth_controller_1.default.login);
router.post("/googleLogin", auth_controller_1.default.googleLogin);
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
       
*       401:
*         description: Lacks valid authentication credentials for the requested resource

        500:
*         description: Server error.
*/
router.post("/logout", auth_controller_1.default.logout);
router.post("/refresh", auth_controller_1.default.refresh);
exports.default = router;
//# sourceMappingURL=auth_route.js.map