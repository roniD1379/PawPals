import post_model, { IPost } from "../models/post_model";
import User from "../models/user_model";
import Comment from "../models/comment_model";
import { mongo } from "mongoose";

class PostService {
  async deleteRelatedComments(post: IPost) {
    return await Comment.deleteMany({ postId: post._id });
  }

  public getNumOfComments(post: IPost) {
    return Comment.find({ postId: post._id }).countDocuments;
  }

  public getNumOfLikes(post: IPost) {
    return post.likes.length;
  }

  public getIsPostOwner(post: IPost, userId: mongo.ObjectId) {
    return post.ownerId.equals(userId);
  }

  public getIsLikedByUser(post: IPost, userId: mongo.ObjectId) {
    return post.likes.includes(userId);
  }

  async getOwnerObj(post: IPost) {
    return await User.findById(post.ownerId);
  }

  public convertToIdObject(id: string) {
    return new mongo.ObjectId(id);
  }

  async like(post: IPost, userId: mongo.ObjectId) {
    if (this.getIsLikedByUser(post, userId)) {
      throw new Error("already liked by user");
    }

    try {
      await post_model.findByIdAndUpdate(post._id, {
        $push: { likes: userId },
      });
    } catch (err) {
      throw new Error("Failed to like post: " + err.message);
    }
  }

  async dislike(post: IPost, userId: mongo.ObjectId) {
    const indexOfUserLike = post.likes.indexOf(userId);

    if (indexOfUserLike > -1) {
      try {
        await post_model.findByIdAndUpdate(post._id, {
          $pull: { likes: userId },
        });
      } catch (err) {
        throw new Error("Failed to dislike post: " + err.message);
      }
    }
  }
}

export default new PostService();
