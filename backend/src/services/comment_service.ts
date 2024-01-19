
import User from "../models/user_model";
import { IComment } from "../models/comment_model";
import {mongo} from 'mongoose';

class CommentService {
    
    public convertToIdObject(id: string){
        return new mongo.ObjectId(id);
    }

    async getOwnerObj(item: IComment) {
        return await User.findById(item.ownerId);
    }
    
}

export default new CommentService();
