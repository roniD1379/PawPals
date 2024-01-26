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
router.get("/details", auth_middleware_1.default, user_controller_1.default.getUserDetails.bind(user_controller_1.default));
router.put("/edit", auth_middleware_1.default, image_middleware_1.imageUploadMiddleware, user_controller_1.default.editUserDetails.bind(user_controller_1.default));
router.delete("/delete", auth_middleware_1.default, user_controller_1.default.deleteUser.bind(user_controller_1.default));
exports.default = router;
//# sourceMappingURL=user_route.js.map