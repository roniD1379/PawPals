import multer from "multer";
import { Request } from "express";
import path from "path";

const storage = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, "C:/PawPals/uploads/");
  },
  filename: function (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.originalname.split(".")[0]}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage: storage });

export const imageUploadMiddleware = upload.single("image");
