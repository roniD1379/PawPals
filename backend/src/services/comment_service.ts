import User from "../models/user_model";
import { IComment } from "../models/comment_model";

class CommentService {
  async getOwnerObj(comment: IComment) {
    return await User.findById(comment.ownerId);
  }
}

export default new CommentService();
