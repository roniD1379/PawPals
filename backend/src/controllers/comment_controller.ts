import Comment from "../models/comment_model";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";
import CommentService from "../services/comment_service";

class CommentController {
  async getPostComments(req: AuthRequest, res: Response) {
    const postId = req.params.id;

    if (!postId || postId === "")
      return res.status(400).send("Post ID is required");

    try {
      const postComments = await Comment.find({ postId })
        .populate("ownerId", "username") // Populate the ownerId field with username
        .sort({ createdAt: -1 }); // Sort comments by createdAt in descending order

      const formattedComments = postComments.map((comment) => ({
        ownerUsername: (comment.ownerId as unknown as { username: string })
          .username,
        comment: comment.text,
        createdAt: comment.createdAt,
      }));

      res.status(200).json(formattedComments);
    } catch (err) {
      res.status(500).json("Fail: " + err.message);
    }
  }

  async createComment(req: AuthRequest, res: Response) {
    const ownerId = req.user._id;
    const text = req.body.text;
    const postId = req.body.postId;

    if (!text || text === "")
      return res.status(400).send("Comment text is required");
    if (!postId || postId === "")
      return res.status(400).send("Post ID is required");

    try {
      const newComment = await Comment.create({
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
