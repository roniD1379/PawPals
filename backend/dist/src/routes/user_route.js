"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const image_middleware_1 = require("../common/image_middleware");
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
* /user/details:
*   get:
*     summary: Get user details
*     tags: [User]
      security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The user details.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*
        500:
*         description: Server error.
*/
router.get("/details", auth_middleware_1.default, user_controller_1.default.getUserDetails.bind(user_controller_1.default));
/**
* @swagger
* /user/edit:
*   put:
*     summary: Edit user details
*     tags: [User]
      security:
*       - bearerAuth: []
      requestBody:
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
*
        500:
*         description: Server error.
*/
router.put("/edit", auth_middleware_1.default, image_middleware_1.imageUploadMiddleware, user_controller_1.default.editUserDetails.bind(user_controller_1.default));
/**
* @swagger
* /user/delete:
*   delete:
*     summary: delete user
*     tags: [User]
      security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The user delete successfully.

*       400:
*         description: Bad request. User not found.
*
        500:
*         description: Server error.
*/
router.delete("/delete", auth_middleware_1.default, user_controller_1.default.deleteUser.bind(user_controller_1.default));
exports.default = router;
//# sourceMappingURL=user_route.js.map