import Comment, { IComment } from "../models/comment_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import CommentService from "../services/comment_service";

class CommentController extends BaseController<IComment>{
    constructor() {
        super(Comment)
    }

    async getById(req: AuthResquest, res: Response) {
        const userIdObject = CommentService.convertToIdObject(req.user._id)
        
        try {
            const commentObj = await Comment.find({_id: userIdObject});

            const output = await Promise.all(commentObj.map(async comment => 
                {
                    const commentOwner = await CommentService.getOwnerObj(comment);
                    return {
                        ...comment.toObject(), // Convert Mongoose document to plain JavaScript objec
                        ownerUsername: commentOwner.username,
                        }
                }));

            res.send(output);

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async post(req: AuthResquest, res: Response) {
        req.body.ownerId = req.user._id;

        super.post(req, res);
    }

   
}

export default new CommentController();
