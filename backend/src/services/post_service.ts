
import { IPost } from "../models/post_model";
import User from "../models/user_model";
import Comment from "../models/comment_model";
import {mongo} from 'mongoose';

class PostService {
    
    public getNumOfComments(item: IPost) {
        return Comment.find({postId: item._id}).countDocuments;
    }

    public getNumOfLikes(item: IPost) {
        return item.likes.length;
    }

    public getIsPostOwner(item: IPost, userId: mongo.ObjectId) {
        return item.ownerId.equals(userId);
    }

    public getIsLikedByUser(item: IPost, userId: mongo.ObjectId) {
        return item.likes.includes(userId);
    }

    async getOwnerObj(item: IPost) {
        return await User.findById(item.ownerId);
    }

    public convertToIdObject(id: string){
        return new mongo.ObjectId(id);
    }


    async like(item : IPost, userId: mongo.ObjectId) {
        item.likes.push(userId);
        
        return item;
    }

    async dislike(item : IPost, userId: mongo.ObjectId) {
        const indexOfUserLike = item.likes.indexOf(userId);

        if (indexOfUserLike > -1) {
            item.likes.splice(indexOfUserLike, 1);
        }
        
        return item;
    }
}

export default new PostService();
