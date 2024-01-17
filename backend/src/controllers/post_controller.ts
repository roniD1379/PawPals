import Post, { IPost } from "../models/post_model";
import User, { IUser } from "../models/user_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import {mongo} from 'mongoose';
import { AuthResquest } from "../common/auth_middleware";
import userController from "./user_controller";


// TODO - add try and catch
//      - add GET req
//      - 

class PostController extends BaseController<IPost>{
    constructor() {
        super(Post)
    }

    //todo
    // async get(req: AuthResquest, res: Response) {
    //     console.log("get:" + req.body.id);
    //     const obj = (super.get(req, res))._id;
    //     const postObj = await Post.findById(obj._id);
    //     //const ownerUser = await User.findById(postObj.userIdOwner)
    //     //const ownerUsername = ownerUser.username;
        
    //    // res.status(201).json({obj,ownerUsername: ownerUsername});
    // }

    async post(req: AuthResquest, res: Response) {
        console.log("post:" + req.body);
        req.body.likes = [];
        req.body.ownerId = req.user._id;
        super.post(req, res);
    }

    async like(req: AuthResquest, res: Response) {
        const objId = new mongo.ObjectId(req.user._id);
        const postObj = await Post.findById(req.params.id);

        postObj.likes.push(objId);
        req.body = postObj;
        super.putById(req, res);
    }

    async dislike(req: AuthResquest, res: Response) {
        const objId = new mongo.ObjectId(req.user._id);
        const postObj = await Post.findById(req.params.id);
        const indexOfUserLike = postObj.likes.indexOf(objId);

        if (indexOfUserLike > -1) {
            postObj.likes.splice(indexOfUserLike, 1);
        }
        
        req.body = postObj;
        super.putById(req, res);
    }
}

export default new PostController();
