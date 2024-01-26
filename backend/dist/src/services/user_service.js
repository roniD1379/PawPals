"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
class UserService {
    getUserNumOfPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_model_1.default.countDocuments({ ownerId: userId });
        });
    }
    generateUniqueUsername(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUsername = email.split("@")[0];
            let username = baseUsername;
            let suffix = 0;
            while (yield this.isUsernameExists(username)) {
                suffix++;
                username = `${baseUsername}${suffix}`;
            }
            return username;
        });
    }
    isUsernameExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ username });
            return user !== null;
        });
    }
}
exports.default = new UserService();
//# sourceMappingURL=user_service.js.map