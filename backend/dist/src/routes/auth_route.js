"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth_controller"));
const image_middleware_1 = require("../common/image_middleware");
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const router = express_1.default.Router();
router.post("/register", image_middleware_1.imageUploadMiddleware, auth_controller_1.default.register);
router.post("/login", auth_controller_1.default.login);
router.post("/logout", auth_controller_1.default.logout);
router.post("/googleLogin", auth_controller_1.default.googleLogin);
router.get("/refresh", auth_middleware_1.default, auth_controller_1.default.refresh);
exports.default = router;
//# sourceMappingURL=auth_route.js.map