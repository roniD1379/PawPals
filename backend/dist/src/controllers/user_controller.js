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
const user_model_1 = __importDefault(require("../models/user_model"));
const base_controller_1 = require("./base_controller");
const user_service_1 = __importDefault(require("../services/user_service"));
class UserController extends base_controller_1.BaseController {
    constructor() {
        super(user_model_1.default);
    }
    getUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user._id;
                const user = yield user_model_1.default.findById(userId).select({ password: 0 });
                const numOfPosts = yield user_service_1.default.getUserNumOfPosts(userId);
                const userDetails = {
                    username: user.username,
                    numOfPosts: numOfPosts,
                    userImage: user.userImage,
                    description: user.description,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phoneNumber: user.phoneNumber,
                };
                res.status(200).send(userDetails);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    editUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let filename = "";
                if (req.file)
                    filename = req.file.filename;
                const userId = req.user._id;
                const firstName = req.body.firstName;
                const lastName = req.body.lastName;
                const userImage = filename ? filename : "";
                const phoneNumber = req.body.phoneNumber;
                const description = req.body.description;
                if (!firstName)
                    return res.status(400).send("First name is required");
                if (!lastName)
                    return res.status(400).send("Last name is required");
                if (!phoneNumber)
                    return res.status(400).send("Phone number is required");
                let user = yield user_model_1.default.findById(userId);
                if (!user)
                    return res.status(400).send("User not found");
                user = yield user_model_1.default.findByIdAndUpdate(userId, {
                    firstName: firstName,
                    lastName: lastName,
                    userImage: userImage === "" ? user.userImage : userImage,
                    phoneNumber: phoneNumber,
                    description: description,
                }, { new: true });
                console.log("Edited user details successfully");
                res.status(200).send(user);
            }
            catch (err) {
                console.log("Failed to edit user details: " + err.message);
                res.status(500).json({ message: err.message });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user._id;
            try {
                const userObj = yield user_model_1.default.findById(userId);
                if (!userObj)
                    return res.status(400).send("user not found");
                yield user_model_1.default.deleteOne({ _id: userObj._id });
                res.status(200).send();
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=user_controller.js.map