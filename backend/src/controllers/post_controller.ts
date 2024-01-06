import StudentPost, { IPost } from "../models/post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";

class StudentPostController extends BaseController<IPost>{
    constructor() {
        super(StudentPost)
    }

    async post(req: AuthResquest, res: Response) {
        console.log("postStudent:" + req.body);
        const _id = req.user._id;
        req.body.owner = _id;
        super.post(req, res);
    }
}

export default new StudentPostController();
