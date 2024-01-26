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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const user_service_1 = __importDefault(require("../services/user_service"));
const USERNAME_REGEX = /^[a-zA-Z0-9]{6,}$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
const client = new google_auth_library_1.OAuth2Client();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filename = "";
    if (req.file)
        filename = req.file.filename;
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userImage = filename ? filename : "";
    const phoneNumber = req.body.phoneNumber;
    const description = req.body.description;
    // Validation
    if (!username || !username.match(USERNAME_REGEX)) {
        return res
            .status(400)
            .send("Username can only contain letters and numbers and must be at least 6 characters long");
    }
    if (!password || !password.match(PASSWORD_REGEX)) {
        return res
            .status(400)
            .send("Password must contain letters and numbers and must be at least 6 characters long");
    }
    if (!firstName)
        return res.status(400).send("First name is required");
    if (!lastName)
        return res.status(400).send("Last name is required");
    if (!phoneNumber)
        return res.status(400).send("Phone number is required");
    try {
        const isUserExists = yield user_model_1.default.findOne({ username: username });
        if (isUserExists != null) {
            return res.status(406).send("Username already exists");
        }
        // Register the user
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield user_model_1.default.create({
            username: username,
            password: encryptedPassword,
            firstName: firstName,
            lastName: lastName,
            userImage: userImage,
            description: description,
            phoneNumber: phoneNumber,
        });
        console.log("User registered successfully, ID: " + newUser._id);
        return res.status(201).send(newUser);
    }
    catch (err) {
        console.log("Registration error: " + err);
        return res.status(500).send("Server error");
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    // Validation
    if (!username)
        return res.status(400).send("Username is required");
    if (!password)
        return res.status(400).send("Password is required");
    try {
        const user = yield user_model_1.default.findOne({ username: username });
        if (user == null) {
            return res.status(400).send("Username or password incorrect");
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(400).send("Username or password incorrect");
        }
        // Create JWT
        const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION,
        });
        const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
        if (user.refreshTokens == null) {
            user.refreshTokens = [refreshToken];
        }
        else {
            user.refreshTokens.push(refreshToken);
        }
        yield user_model_1.default.updateOne({ _id: user._id }, { refreshTokens: user.refreshTokens });
        return res.status(200).send({
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    }
    catch (err) {
        console.log("Login error: " + err);
        return res.status(500).send("Server error");
    }
});
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { credential, client_id } = req.body;
    try {
        const ticket = yield client.verifyIdToken({
            idToken: credential,
            audience: client_id,
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        const givenName = payload.given_name;
        const familyName = payload.family_name;
        const profileImage = payload.picture;
        let username = email.split("@")[0];
        let user = yield user_model_1.default.findOne({ username: username });
        if (!user) {
            username = yield user_service_1.default.generateUniqueUsername(email);
            user = yield user_model_1.default.create({
                username: username,
                firstName: givenName,
                lastName: familyName,
                description: "",
                userImage: profileImage,
                phoneNumber: "-",
                password: "-",
                authSource: "google",
            });
        }
        // Create JWT
        const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION,
        });
        const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
        if (user.refreshTokens == null) {
            user.refreshTokens = [refreshToken];
        }
        else {
            user.refreshTokens.push(refreshToken);
        }
        yield user_model_1.default.updateOne({ _id: user._id }, { refreshTokens: user.refreshTokens });
        return res.status(200).send({
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    }
    catch (err) {
        console.log("Google login error: " + err);
        return res.status(500).send("Server error");
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.refreshToken;
    if (refreshToken == null) {
        return res.status(401).send();
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).send();
        }
        try {
            const userDb = yield user_model_1.default.findOne({ _id: user._id });
            if (!userDb.refreshTokens ||
                !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                yield userDb.save();
                return res.status(401).send();
            }
            else {
                userDb.refreshTokens = userDb.refreshTokens.filter((t) => t !== refreshToken);
                yield userDb.save();
                return res.status(200).send();
            }
        }
        catch (err) {
            return res.status(500).send(err.message);
        }
    }));
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.refreshToken;
    if (refreshToken == null) {
        return res.status(401).send();
    }
    console.log("got into");
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(401).send();
        try {
            const userDb = yield user_model_1.default.findOne({ _id: user._id });
            if (!userDb.refreshTokens ||
                !userDb.refreshTokens.includes(refreshToken)) {
                console.log("Refresh token not found");
                userDb.refreshTokens = [];
                yield user_model_1.default.updateOne({ _id: userDb._id }, { refreshTokens: userDb.refreshTokens });
                return res.status(401).send();
            }
            const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const newRefreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
            userDb.refreshTokens = userDb.refreshTokens.filter((t) => t !== refreshToken);
            userDb.refreshTokens.push(newRefreshToken);
            yield user_model_1.default.updateOne({ _id: userDb._id }, { refreshTokens: userDb.refreshTokens });
            return res.status(200).send({
                accessToken: accessToken,
                refreshToken: newRefreshToken,
            });
        }
        catch (err) {
            return res.status(500).send(err.message);
        }
    }));
});
exports.default = {
    register,
    login,
    googleLogin,
    logout,
    refresh,
};
//# sourceMappingURL=auth_controller.js.map