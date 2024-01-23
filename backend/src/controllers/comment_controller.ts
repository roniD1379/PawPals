import Comment, { IComment } from "../models/comment_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import CommentService from "../services/comment_service";
import comment_model from "../models/comment_model";

class CommentController extends BaseController<IComment> {
  constructor() {
    super(Comment);
  }

  async getById(req: AuthResquest, res: Response) {
    const userIdObject = CommentService.convertToIdObject(req.user._id);

    try {
      const commentObj = await Comment.find({ _id: userIdObject });

      const output = await Promise.all(
        commentObj.map(async (comment) => {
          const commentOwner = await CommentService.getOwnerObj(comment);
          return {
            ...comment.toObject(), // Convert Mongoose document to plain JavaScript objec
            ownerUsername: commentOwner.username,
          };
        })
      );

      res.send(output);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async createComment(req: AuthResquest, res: Response) {
    const ownerId = req.user._id;
    const text = req.body.text;
    const postId = req.body.postId;

    if (!text || text === "")
      return res.status(400).send("Comment text is required");
    if (!postId || postId === "")
      return res.status(400).send("Post ID is required");

    try {
      const newComment = await comment_model.create({
        postId: postId,
        text: text,
        ownerId: ownerId,
      });

      const commentOwner = await CommentService.getOwnerObj(newComment);

      console.log("Comment created successfully");
      res
        .status(201)
        .send({ newComment: newComment, ownerUsername: commentOwner.username });
    } catch (err) {
      res.status(500).send("Fail: " + err.message);
    }
  }
}

export default new CommentController();
