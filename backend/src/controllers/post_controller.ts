import Post, { IPost } from "../models/post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest} from "../common/auth_middleware";
import PostService from "../services/post_service";


class PostController extends BaseController<IPost>{
    constructor() {
        super(Post)
    }

    async getAll(req: AuthResquest, res: Response) {
        const userIdObject = PostService.convertToIdObject(req.user._id)

        try {
            const posts = await Post.find();

            const output = await Promise.all(posts.map(async post => 
                {
                    const postOwner = await PostService.getOwnerObj(post);

                    return {
                        ...post.toObject(), // Convert Mongoose document to plain JavaScript object
                        ownerUsername: postOwner.username,
                        ownerFirstName: postOwner.firstname,
                        ownerPhoneNumber: postOwner.phoneNumber,
                        isLikedByUser: PostService.getIsLikedByUser(post,userIdObject),
                        isPostOwner: PostService.getIsPostOwner(post, userIdObject),
                        numOfLikes: PostService.getNumOfLikes(post),
                        numOfComments: PostService.getNumOfComments(post)
                    }
                }));

            res.send(output);

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async post(req: AuthResquest, res: Response) {
        req.body.likes = [];
        req.body.ownerId = req.user._id;
        
        super.post(req, res);
    }

    async like(req: AuthResquest, res: Response) {
        
        try {
            const userId = PostService.convertToIdObject(req.user._id);
            const postObj = await Post.findById(req.body._id);
            
            req.body = PostService.like(postObj,userId);
            
            super.putById(req, res);

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async dislike(req: AuthResquest, res: Response) {
        try {
            const userId = PostService.convertToIdObject(req.user._id);
            const postObj = await Post.findById(req.body._id);
            
            req.body = PostService.dislike(postObj,userId);
            
            super.putById(req, res);

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default new PostController();
