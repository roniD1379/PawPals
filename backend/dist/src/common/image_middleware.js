"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageUploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, "C:/PawPals/uploads/");
    },
    filename: function (_req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${file.originalname.split(".")[0]}-${Date.now()}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
exports.imageUploadMiddleware = upload.single("image");
//# sourceMappingURL=image_middleware.js.map