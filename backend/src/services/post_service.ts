import post_model, { IPost } from "../models/post_model";
import User from "../models/user_model";
import Comment from "../models/comment_model";
import { mongo } from "mongoose";

class PostService {
  async deleteRelatedComments(post: IPost) {
    return await Comment.deleteMany({ postId: post._id });
  }

  async getNumOfComments(post: IPost) {
    const numOfComments = await Comment.countDocuments({ postId: post._id });
    return numOfComments;
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
    try {
      if (this.getIsLikedByUser(post, userId)) {
        throw new Error("already liked by user");
      }

      await post_model.findByIdAndUpdate(post._id, {
        $push: { likes: userId },
      });
    } catch (err) {
      throw new Error("Failed to like post: " + err.message);
    }
  }

  async dislike(post: IPost, userId: mongo.ObjectId) {
    const indexOfUserLike = post.likes.indexOf(userId);

    try {
      if (indexOfUserLike == -1) {
        throw new Error("Post wasn't liked by user");
      }

      await post_model.findByIdAndUpdate(post._id, {
        $pull: { likes: userId },
      });
    } catch (err) {
      throw new Error("Failed to dislike post: " + err.message);
    }
  }

  async formatPost(post: IPost, userIdObject: mongo.ObjectId) {
    const postOwner = await this.getOwnerObj(post);

    return {
      _id: post._id,
      description: post.description,
      img: post.image,
      breed: post.breed,
      breedId: post.breedId,
      ownerId: post.ownerId,
      createdAt: post.createdAt,
      ownerUsername: postOwner.username,
      ownerFirstName: postOwner.firstName,
      ownerPhoneNumber: postOwner.phoneNumber,
      isLikedByUser: this.getIsLikedByUser(post, userIdObject),
      isPostOwner: this.getIsPostOwner(post, userIdObject),
      numOfLikes: this.getNumOfLikes(post),
      numOfComments: await this.getNumOfComments(post),
    };
  }

  async formatPosts(posts: IPost[], userIdObject: mongo.ObjectId) {
    try {
      const formattedPosts = await Promise.all(
        posts.map((post) => this.formatPost(post, userIdObject))
      );

      return formattedPosts;
    } catch (error) {
      console.error("Error formatting posts:", error);
      throw error;
    }
  }
}

export default new PostService();
