"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
router.get("/", auth_middleware_1.default, user_controller_1.default.get.bind(user_controller_1.default));
router.get("/:id", auth_middleware_1.default, user_controller_1.default.getById.bind(user_controller_1.default));
router.post("/", auth_middleware_1.default, user_controller_1.default.post.bind(user_controller_1.default));
router.put("/:id", auth_middleware_1.default, user_controller_1.default.putById.bind(user_controller_1.default));
router.delete("/:id", auth_middleware_1.default, user_controller_1.default.deleteById.bind(user_controller_1.default));
exports.default = router;
//# sourceMappingURL=user_route.js.map