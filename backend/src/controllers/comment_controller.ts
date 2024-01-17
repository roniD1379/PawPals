import Comment, { IComment } from "../models/comment_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import {mongo} from 'mongoose';
import { AuthResquest } from "../common/auth_middleware";

class CommentController extends BaseController<IComment>{
    constructor() {
        super(Comment)
    }

    //todo
    // async get(req: AuthResquest, res: Response) {
    //     console.log("get:" + req.body);
    //     //req.body.ownerUsername = await userController.getById(req,res).then(result => result.username);
    //     // return await super.get(req, res).then(res => 
    //     //     {
    //     //         //res.ownerUsername = await User.findById(req.body.ownerId);
    //     //     });
    // }

    async comment(req: AuthResquest, res: Response) {
        console.log("post:" + req.body);
        req.body.ownerId = req.user._id;
        super.post(req, res);
    }
}

export default new CommentController();
