
import { IPost } from "../models/post_model";
import User from "../models/user_model";
import Comment from "../models/comment_model";
import { mongo} from 'mongoose';

class PostService {

    async deleteRelatedComments(post: IPost) {
        return await Comment.deleteMany({postId: post._id});
    }
    
    public getNumOfComments(post: IPost) {
        return Comment.find({postId: post._id}).countDocuments;
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

    public convertToIdObject(id: string){
        return new mongo.ObjectId(id);
    }

    async like(post : IPost, userId: mongo.ObjectId) {
        
        if(this.getIsLikedByUser(post,userId)){
            throw new Error("already liked by user");
        }

        post.likes.push(userId);
        
        return post;
    }

    async dislike(post : IPost, userId: mongo.ObjectId) {
        const indexOfUserLike = post.likes.indexOf(userId);

        if (indexOfUserLike > -1) {
            post.likes.splice(indexOfUserLike, 1);
        }
        
        return post;
    }
}

export default new PostService();
