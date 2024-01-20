
import User from "../models/user_model";
import { IComment } from "../models/comment_model";
import {mongo} from 'mongoose';

class CommentService {
    
    public convertToIdObject(id: string){
        return new mongo.ObjectId(id);
    }

    async getOwnerObj(comment: IComment) {
        return await User.findById(comment.ownerId);
    }
    
}

export default new CommentService();
